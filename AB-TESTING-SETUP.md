# A/B Testing System Deployment Guide

## Overview
This guide covers deploying the A/B testing system for Amazon affiliate products to new Azure Static Web Apps.

---

## Prerequisites
- Azure CLI installed and logged in (`az login`)
- GitHub CLI installed (`gh auth login`)
- Node.js installed

---

## Step 1: Create Azure Storage Account

```bash
# Replace variables
STORAGE_NAME="yoursaborchitect"  # Must be globally unique, lowercase, no hyphens
RESOURCE_GROUP="DefaultResourceGroup-EUS2"  # Or your preferred RG
LOCATION="eastus2"

# Create storage account
az storage account create \
  --name $STORAGE_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --sku Standard_LRS \
  --kind StorageV2 \
  --allow-blob-public-access false

# Create tables
az storage table create --name Products --account-name $STORAGE_NAME --auth-mode login
az storage table create --name Variants --account-name $STORAGE_NAME --auth-mode login
az storage table create --name DailyStats --account-name $STORAGE_NAME --auth-mode login

# Get connection string (save this!)
az storage account show-connection-string --name $STORAGE_NAME --resource-group $RESOURCE_GROUP --query connectionString -o tsv
```

---

## Step 2: Copy API Folder

Copy the `/api` folder from this repo to your new site:

```
/api
├── package.json
├── host.json
├── .gitignore
└── src/
    ├── functions/
    │   ├── getProducts.js
    │   ├── trackImpression.js
    │   ├── trackClick.js
    │   ├── analyzeVariants.js
    │   └── seedProducts.js
    └── services/
        └── tableStorage.js
```

---

## Step 3: Update GitHub Workflow

In your `.github/workflows/azure-static-web-apps-*.yml`, set:

```yaml
api_location: "api"
```

---

## Step 4: Configure Static Web App Settings

```bash
# Replace with your values
SWA_NAME="YourStaticWebAppName"
CONNECTION_STRING="your-connection-string-from-step-1"

az staticwebapp appsettings set \
  --name $SWA_NAME \
  --setting-names \
    "AZURE_STORAGE_CONNECTION_STRING=$CONNECTION_STRING" \
    "ADMIN_API_KEY=your-secret-key-here" \
    "AB_MIN_IMPRESSIONS=50" \
    "AB_MIN_DAYS=7" \
    "AB_DROP_THRESHOLD=0.5"
```

---

## Step 5: Add Frontend Client

1. Copy `abtest.js` to your site root

2. Add to your HTML page (before `</body>`):
```html
<script src="abtest.js"></script>
<script>
document.addEventListener('DOMContentLoaded', async function() {
    await ABTest.loadProducts('your-container-id');
});
</script>
```

3. Give your product container an ID:
```html
<div class="books-grid" id="your-container-id">
    <!-- Fallback static content here -->
</div>
```

---

## Step 6: Create Seed Data

Create `seed-data.json` with your products:

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
          "description": "Product description",
          "amazonUrl": "https://www.amazon.com/dp/ASIN?tag=your-affiliate-tag",
          "imageUrl": "https://example.com/image.jpg",
          "tags": ["Tag1", "Tag2"]
        },
        {
          "title": "Alternative Product (A/B variant)",
          "author": "Other Author",
          "description": "Alternative description",
          "amazonUrl": "https://www.amazon.com/dp/OTHER-ASIN?tag=your-affiliate-tag",
          "imageUrl": "https://example.com/other-image.jpg",
          "tags": ["Tag1", "Tag3"]
        }
      ]
    }
  ]
}
```

**Note:** Each slot can have multiple variants. The system will randomly select one based on weighted performance.

---

## Step 7: Deploy and Seed

```bash
# Push to deploy
git add -A && git commit -m "Add A/B testing" && git push

# Wait for deployment (~2 min), then seed
curl -X POST "https://your-site.azurestaticapps.net/api/seed" \
  -H "Content-Type: application/json" \
  -H "x-admin-key: your-secret-key-here" \
  -d @seed-data.json
```

---

## Adding Images

### Option 1: Amazon Product Images (Recommended)
Use Amazon's product image URLs. Format:
```
https://m.media-amazon.com/images/I/{IMAGE-ID}._SX300_.jpg
```

To find the image URL:
1. Go to Amazon product page
2. Right-click the product image → "Copy image address"
3. Use that URL in `imageUrl`

### Option 2: Host Your Own Images
Store images in Azure Blob Storage or your site's `/images` folder.

### Updating Existing Products with Images

Create a new seed file with imageUrl populated:

```json
{
  "products": [
    {
      "slotId": "slot-1",
      "slotName": "SAA-C03 Study Guide",
      "variants": [
        {
          "title": "AWS Certified Solutions Architect Study Guide",
          "author": "Ben Piper & David Clinton",
          "description": "Comprehensive study guide...",
          "amazonUrl": "https://www.amazon.com/dp/1119982626?tag=dreamscribe09-20",
          "imageUrl": "https://m.media-amazon.com/images/I/51CFN0L7qjL._SX300_.jpg",
          "tags": ["Best Seller", "SAA-C03"]
        }
      ]
    }
  ]
}
```

Then re-seed (new variants will be added alongside existing ones).

---

## API Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products` | GET | Get weighted-random products |
| `/api/track/impression` | POST | Track product view |
| `/api/track/click` | POST | Track affiliate click |
| `/api/seed` | POST | Seed products (requires x-admin-key header) |

---

## How A/B Testing Works

1. **Multiple variants per slot**: Add 2+ variants to a slot to test different products
2. **Weighted selection**: Higher-performing variants get shown more often
3. **Daily analysis** (6 AM UTC):
   - Calculates 7-day rolling CTR per variant
   - Drops variants with CTR < 50% of slot average
   - Adjusts weights based on relative performance
4. **Minimum thresholds**: Variants need 50+ impressions and 7+ days before evaluation

---

## Estimated Costs

| Resource | Monthly Cost |
|----------|-------------|
| Azure Table Storage | ~$0.05 (at low volume) |
| Azure Functions | FREE (included with SWA) |
| **Total** | **~$0.05-0.50/month** |
