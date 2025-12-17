const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const ADMIN_KEY = process.env.ADMIN_API_KEY || "aws-ab-admin-2025";

async function clearProducts(request, context) {
  // Check admin key
  const authKey = request.headers.get("x-admin-key");
  if (authKey !== ADMIN_KEY) {
    return {
      status: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  try {
    const productsTable = TableClient.fromConnectionString(connectionString, "Products");
    const variantsTable = TableClient.fromConnectionString(connectionString, "Variants");
    const dailyStatsTable = TableClient.fromConnectionString(connectionString, "DailyStats");

    let productsDeleted = 0;
    let variantsDeleted = 0;
    let statsDeleted = 0;

    // Delete all products
    const products = productsTable.listEntities();
    for await (const entity of products) {
      await productsTable.deleteEntity(entity.partitionKey, entity.rowKey);
      productsDeleted++;
    }

    // Delete all variants
    const variants = variantsTable.listEntities();
    for await (const entity of variants) {
      await variantsTable.deleteEntity(entity.partitionKey, entity.rowKey);
      variantsDeleted++;
    }

    // Delete all stats
    const stats = dailyStatsTable.listEntities();
    for await (const entity of stats) {
      await dailyStatsTable.deleteEntity(entity.partitionKey, entity.rowKey);
      statsDeleted++;
    }

    context.log(`Cleared: ${productsDeleted} products, ${variantsDeleted} variants, ${statsDeleted} stats`);

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        productsDeleted,
        variantsDeleted,
        statsDeleted
      })
    };
  } catch (error) {
    context.error("Error clearing products:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to clear products", details: error.message })
    };
  }
}

app.http("clearProducts", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "clear",
  handler: clearProducts
});
