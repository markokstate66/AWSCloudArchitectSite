/**
 * A/B Testing Client for AWS Cloud Architect affiliate products
 * Fetches products from API, renders dynamically, tracks impressions and clicks
 */
const ABTest = {
  API_BASE: '/api',
  sessionId: null,
  loadedVariants: {},
  initialized: false,

  // Initialize session
  init() {
    if (this.initialized) return;
    this.sessionId = this.getOrCreateSessionId();
    this.initialized = true;
  },

  // Get or create anonymous session ID
  getOrCreateSessionId() {
    let id = sessionStorage.getItem('ab_session_id');
    if (!id) {
      id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('ab_session_id', id);
    }
    return id;
  },

  // Fetch products from API with timeout
  async fetchProducts(timeoutMs = 3000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${this.API_BASE}/products`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('API returned ' + response.status);
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn('A/B test API timeout');
      } else {
        console.warn('A/B test API error:', error.message);
      }
      return null;
    }
  },

  // Track impression (fire and forget)
  trackImpression(variantId, slotId) {
    const data = JSON.stringify({
      variantId,
      slotId,
      sessionId: this.sessionId,
      page: window.location.pathname
    });

    // Use sendBeacon if available for reliability
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${this.API_BASE}/track/impression`, data);
    } else {
      fetch(`${this.API_BASE}/track/impression`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true
      }).catch(() => {}); // Silent fail
    }
  },

  // Track click (must be reliable - user is navigating away)
  trackClick(variantId, slotId) {
    const data = JSON.stringify({
      variantId,
      slotId,
      sessionId: this.sessionId,
      page: window.location.pathname
    });

    // Use sendBeacon for reliability on navigation
    if (navigator.sendBeacon) {
      navigator.sendBeacon(`${this.API_BASE}/track/click`, data);
    } else {
      fetch(`${this.API_BASE}/track/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: data,
        keepalive: true
      }).catch(() => {}); // Silent fail
    }
  },

  // Create book card HTML
  createBookCard(product) {
    const tags = product.tags || [];
    const tagsHtml = tags.map(tag => `<span class="book-tag">${this.escapeHtml(tag)}</span>`).join('');

    return `
      <div class="book-card" data-slot-id="${this.escapeHtml(product.slotId)}">
        <div class="book-cover">
          ${product.imageUrl
            ? `<img src="${this.escapeHtml(product.imageUrl)}" alt="${this.escapeHtml(product.title)}">`
            : '<div class="book-placeholder">&#128214;</div>'
          }
        </div>
        <div class="book-info">
          <h3>${this.escapeHtml(product.title)}</h3>
          <p class="book-author">by ${this.escapeHtml(product.author)}</p>
          <p class="book-description">${this.escapeHtml(product.description)}</p>
          <div class="book-meta">${tagsHtml}</div>
          <a href="${this.escapeHtml(product.amazonUrl)}"
             target="_blank"
             rel="noopener"
             class="book-link"
             data-variant-id="${this.escapeHtml(product.variantId)}"
             data-slot-id="${this.escapeHtml(product.slotId)}">View on Amazon</a>
        </div>
      </div>
    `;
  },

  // Escape HTML to prevent XSS
  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  // Render products into container
  renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !products || products.length === 0) return false;

    // Generate HTML for all products
    const html = products.map(product => this.createBookCard(product)).join('');
    container.innerHTML = html;

    // Track impressions for all rendered products
    products.forEach(p => {
      this.trackImpression(p.variantId, p.slotId);
      this.loadedVariants[p.slotId] = p.variantId;
    });

    // Attach click handlers to affiliate links
    container.querySelectorAll('.book-link[data-variant-id]').forEach(link => {
      link.addEventListener('click', (e) => {
        const variantId = e.currentTarget.dataset.variantId;
        const slotId = e.currentTarget.dataset.slotId;
        this.trackClick(variantId, slotId);
      });
    });

    return true;
  },

  // Main entry point - load and render products
  async loadProducts(containerId) {
    this.init();
    const products = await this.fetchProducts();

    if (products && products.length > 0) {
      return this.renderProducts(products, containerId);
    }

    // API failed or no products - fallback content stays visible
    return false;
  }
};

// Auto-initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  ABTest.init();
});
