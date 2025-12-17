# A/B Testing Amazon Affiliate Products - Setup Prompt

Use this prompt with Claude Code to set up A/B testing for Amazon affiliate products on any Azure Static Web App project.

---

## Quick Start Prompt

Copy and paste this to Claude Code:

```
Set up an A/B testing system for Amazon affiliate products using Azure Functions + Table Storage.

Requirements:
1. Create Azure Functions API in /api folder (Node.js, not TypeScript)
2. Use Azure Table Storage for data (Products, Variants, DailyStats tables)
3. Track impressions and clicks per product variant
4. Daily timer function to analyze CTR and drop underperformers
5. Weighted random selection (higher CTR = higher weight)
6. Admin endpoints protected by API key
7. Host book cover images locally in /images/books/

API Endpoints needed:
- GET /api/products - Returns weighted-random variant per slot
- POST /api/track/impression - Records product view
- POST /api/track/click - Records affiliate click
- POST /api/seed - Seeds products (requires x-admin-key header)
- POST /api/clear - Clears all data (requires x-admin-key header)
- GET /api/stats - Returns all stats for admin dashboard
- Timer trigger (daily 6AM UTC) - Analyzes CTR, drops losers

My Amazon affiliate tag is: [YOUR-TAG-HERE]

Create seed-data.json with this structure for my products:
[List your products here with title, author, description, amazonUrl, tags]
```

---

## Complete File Structure

```
/your-project
├── /api
│   ├── package.json
│   ├── host.json
│   └── /src
│       └── /functions
│           ├── getProducts.js
│           ├── trackImpression.js
│           ├── trackClick.js
│           ├── seedProducts.js
│           ├── clearProducts.js
│           ├── getStats.js
│           └── analyzeVariants.js
├── /images
│   └── /books
│       └── [book-cover].jpg
├── abtest.js
├── seed-data.json
├── admin.html
└── staticwebapp.config.json
```

---

## Seed Data Format

```json
{
  "products": [
    {
      "slotId": "slot-1",
      "slotName": "Category Name",
      "variants": [
        {
          "title": "Product Title",
          "author": "Author Name",
          "description": "Product description for display.",
          "amazonUrl": "https://www.amazon.com/dp/ASIN?tag=YOUR-TAG-20",
          "imageUrl": "/images/books/filename.jpg",
          "tags": ["Tag1", "Tag2"]
        }
      ]
    }
  ]
}
```

---

## Azure Setup Steps

### 1. Create Storage Account

```bash
# Create resource group (or use existing)
az group create --name YourResourceGroup --location eastus2

# Create storage account
az storage account create \
  --name yourstorageaccount \
  --resource-group YourResourceGroup \
  --location eastus2 \
  --sku Standard_LRS

# Get connection string
az storage account show-connection-string \
  --name yourstorageaccount \
  --resource-group YourResourceGroup \
  --query connectionString -o tsv
```

### 2. Create Tables

```bash
CONNECTION_STRING="your-connection-string"

az storage table create --name Products --connection-string "$CONNECTION_STRING"
az storage table create --name Variants --connection-string "$CONNECTION_STRING"
az storage table create --name DailyStats --connection-string "$CONNECTION_STRING"
```

### 3. Configure Static Web App

Add the connection string to your Static Web App:

```bash
az staticwebapp appsettings set \
  --name YourStaticWebApp \
  --resource-group YourResourceGroup \
  --setting-names \
    AZURE_STORAGE_CONNECTION_STRING="your-connection-string" \
    ADMIN_API_KEY="your-secret-key"
```

---

## Frontend Integration

Add this to your HTML page where you want products displayed:

```html
<!-- Container for A/B tested products -->
<div id="ab-products" class="product-grid"></div>

<!-- Load A/B testing script -->
<script src="/abtest.js"></script>
```

The `abtest.js` script will:
1. Fetch products from `/api/products`
2. Render them in the container
3. Track impressions automatically
4. Track clicks when users click affiliate links

---

## Admin Dashboard

Access stats at `/admin.html` (requires Azure AD login if configured).

To seed products via CLI:
```bash
curl -X POST "https://your-site.azurestaticapps.net/api/seed" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-secret-key" \
  -d @seed-data.json
```

To clear all data:
```bash
curl -X POST "https://your-site.azurestaticapps.net/api/clear" \
  -H "x-admin-key: your-secret-key"
```

---

## Book Cover Images

Amazon blocks hotlinking. Download covers from Open Library:

```bash
# Download by ISBN
curl -sL -o "book-name.jpg" "https://covers.openlibrary.org/b/isbn/ISBN-NUMBER-L.jpg"
```

Store in `/images/books/` and reference as `/images/books/book-name.jpg` in seed data.

---

## A/B Algorithm Details

1. **Selection**: Weighted random - higher CTR variants get selected more often
2. **Minimum data**: 50 impressions + 7 days before evaluation
3. **Drop rule**: If variant CTR < 50% of slot average → mark as dropped
4. **Weight formula**: `weight = 100 * (variantCTR / slotAverageCTR)`

---

## staticwebapp.config.json Updates

Add these routes:

```json
{
  "routes": [
    {
      "route": "/admin.html",
      "allowedRoles": ["admin"]
    },
    {
      "route": "/api/stats",
      "allowedRoles": ["admin"]
    }
  ],
  "globalHeaders": {
    "Content-Security-Policy": "... img-src 'self' data: https:; ..."
  }
}
```

---

## GitHub Actions

Ensure your workflow has `api_location: "api"`:

```yaml
- name: Build And Deploy
  uses: Azure/static-web-apps-deploy@v1
  with:
    app_location: "/"
    api_location: "api"
    output_location: ""
```

---

## Estimated Costs

- **Storage Account**: ~$0.01-0.05/month (minimal table operations)
- **Azure Functions**: Free tier covers most usage
- **Total**: ~$0.05-0.50/month for moderate traffic

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on API | Check `api_location` in GitHub workflow |
| Images broken | Use local images, not Amazon URLs |
| Auth redirect loop | Check `allowedRoles` in config |
| No stats showing | Ensure storage connection string is set |

---

## Example Products for Different Niches

### Tech/Programming Books
```json
{
  "title": "Clean Code",
  "amazonUrl": "https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882?tag=YOUR-TAG-20",
  "tags": ["Programming", "Best Practices"]
}
```

### Fitness Equipment
```json
{
  "title": "Resistance Bands Set",
  "amazonUrl": "https://www.amazon.com/dp/B07XYZ123?tag=YOUR-TAG-20",
  "tags": ["Home Gym", "Budget"]
}
```

### Kitchen Gadgets
```json
{
  "title": "Instant Pot Duo",
  "amazonUrl": "https://www.amazon.com/dp/B07XYZ456?tag=YOUR-TAG-20",
  "tags": ["Best Seller", "Kitchen"]
}
```

---

## Quick Reference Commands

```bash
# Seed products
curl -X POST "https://YOUR-SITE/api/seed" -H "Content-Type: application/json" -H "x-admin-key: YOUR-KEY" -d @seed-data.json

# Clear all data
curl -X POST "https://YOUR-SITE/api/clear" -H "x-admin-key: YOUR-KEY"

# Check products
curl "https://YOUR-SITE/api/products"

# Download book cover
curl -sL -o "cover.jpg" "https://covers.openlibrary.org/b/isbn/ISBN-L.jpg"
```
