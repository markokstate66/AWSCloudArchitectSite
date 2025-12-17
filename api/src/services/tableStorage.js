const { TableClient, odata } = require("@azure/data-tables");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";

// Table clients
const productsTable = TableClient.fromConnectionString(connectionString, "Products");
const variantsTable = TableClient.fromConnectionString(connectionString, "Variants");
const dailyStatsTable = TableClient.fromConnectionString(connectionString, "DailyStats");

// Helper to get today's date string
function getTodayString() {
  return new Date().toISOString().split("T")[0];
}

// Products operations
async function getActiveProducts() {
  const products = [];
  const entities = productsTable.listEntities({
    queryOptions: { filter: odata`isActive eq true` }
  });
  for await (const entity of entities) {
    products.push(entity);
  }
  return products;
}

async function createProduct(slotId, slotName) {
  await productsTable.createEntity({
    partitionKey: "products",
    rowKey: slotId,
    slotName,
    isActive: true,
    createdAt: new Date().toISOString()
  });
}

// Variants operations
async function getActiveVariantsForSlot(slotId) {
  const variants = [];
  const entities = variantsTable.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${slotId} and isActive eq true` }
  });
  for await (const entity of entities) {
    variants.push(entity);
  }
  return variants;
}

async function createVariant(slotId, variantId, data) {
  await variantsTable.createEntity({
    partitionKey: slotId,
    rowKey: variantId,
    title: data.title,
    author: data.author,
    description: data.description,
    amazonUrl: data.amazonUrl,
    imageUrl: data.imageUrl || "",
    tags: JSON.stringify(data.tags),
    isActive: true,
    weight: 100,
    createdAt: new Date().toISOString()
  });
}

async function updateVariantWeight(slotId, variantId, weight) {
  const entity = await variantsTable.getEntity(slotId, variantId);
  await variantsTable.updateEntity({ ...entity, weight }, "Merge");
}

async function dropVariant(slotId, variantId, reason) {
  const entity = await variantsTable.getEntity(slotId, variantId);
  await variantsTable.updateEntity({
    ...entity,
    isActive: false,
    weight: 0,
    droppedAt: new Date().toISOString(),
    dropReason: reason
  }, "Merge");
}

// DailyStats operations
async function incrementImpression(variantId) {
  const today = getTodayString();
  try {
    const entity = await dailyStatsTable.getEntity(variantId, today);
    const impressions = (entity.impressions || 0) + 1;
    const clicks = entity.clicks || 0;
    await dailyStatsTable.updateEntity({
      ...entity,
      impressions,
      ctr: clicks > 0 ? (clicks / impressions) * 100 : 0
    }, "Merge");
  } catch (error) {
    if (error.statusCode === 404) {
      await dailyStatsTable.createEntity({
        partitionKey: variantId,
        rowKey: today,
        impressions: 1,
        clicks: 0,
        ctr: 0
      });
    } else {
      throw error;
    }
  }
}

async function incrementClick(variantId) {
  const today = getTodayString();
  try {
    const entity = await dailyStatsTable.getEntity(variantId, today);
    const clicks = (entity.clicks || 0) + 1;
    const impressions = entity.impressions || 1;
    await dailyStatsTable.updateEntity({
      ...entity,
      clicks,
      ctr: (clicks / impressions) * 100
    }, "Merge");
  } catch (error) {
    if (error.statusCode === 404) {
      await dailyStatsTable.createEntity({
        partitionKey: variantId,
        rowKey: today,
        impressions: 1,
        clicks: 1,
        ctr: 100
      });
    } else {
      throw error;
    }
  }
}

async function getStatsForVariant(variantId, days = 7) {
  const stats = [];
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffString = cutoffDate.toISOString().split("T")[0];

  const entities = dailyStatsTable.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${variantId} and RowKey ge ${cutoffString}` }
  });

  for await (const entity of entities) {
    stats.push(entity);
  }
  return stats;
}

async function getTotalImpressions(variantId) {
  let total = 0;
  const entities = dailyStatsTable.listEntities({
    queryOptions: { filter: odata`PartitionKey eq ${variantId}` }
  });
  for await (const entity of entities) {
    total += entity.impressions || 0;
  }
  return total;
}

// Weighted random selection
function selectVariantWeighted(variants) {
  const activeVariants = variants.filter(v => v.isActive);
  if (activeVariants.length === 0) throw new Error("No active variants");
  if (activeVariants.length === 1) return activeVariants[0];

  const totalWeight = activeVariants.reduce((sum, v) => sum + (v.weight || 100), 0);
  let random = Math.random() * totalWeight;

  for (const variant of activeVariants) {
    random -= (variant.weight || 100);
    if (random <= 0) return variant;
  }

  return activeVariants[activeVariants.length - 1];
}

// Calculate rolling CTR
function calculateRollingCTR(stats) {
  const totalImpressions = stats.reduce((sum, s) => sum + (s.impressions || 0), 0);
  const totalClicks = stats.reduce((sum, s) => sum + (s.clicks || 0), 0);
  if (totalImpressions === 0) return 0;
  return (totalClicks / totalImpressions) * 100;
}

module.exports = {
  getActiveProducts,
  createProduct,
  getActiveVariantsForSlot,
  createVariant,
  updateVariantWeight,
  dropVariant,
  incrementImpression,
  incrementClick,
  getStatsForVariant,
  getTotalImpressions,
  selectVariantWeighted,
  calculateRollingCTR
};
