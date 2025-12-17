const { app } = require("@azure/functions");
const { TableClient, odata } = require("@azure/data-tables");

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";

async function getStats(request, context) {
  try {
    const productsTable = TableClient.fromConnectionString(connectionString, "Products");
    const variantsTable = TableClient.fromConnectionString(connectionString, "Variants");
    const dailyStatsTable = TableClient.fromConnectionString(connectionString, "DailyStats");

    const stats = [];

    // Get all products
    const products = productsTable.listEntities();
    for await (const product of products) {
      const slotId = product.rowKey;

      // Get variants for this slot
      const variants = variantsTable.listEntities({
        queryOptions: { filter: odata`PartitionKey eq ${slotId}` }
      });

      for await (const variant of variants) {
        const variantId = variant.rowKey;

        // Get daily stats for this variant
        let totalImpressions = 0;
        let totalClicks = 0;
        const dailyData = [];

        const variantStats = dailyStatsTable.listEntities({
          queryOptions: { filter: odata`PartitionKey eq ${variantId}` }
        });

        for await (const stat of variantStats) {
          totalImpressions += stat.impressions || 0;
          totalClicks += stat.clicks || 0;
          dailyData.push({
            date: stat.rowKey,
            impressions: stat.impressions || 0,
            clicks: stat.clicks || 0,
            ctr: stat.ctr || 0
          });
        }

        // Sort daily data by date descending
        dailyData.sort((a, b) => b.date.localeCompare(a.date));

        stats.push({
          slotId,
          slotName: product.slotName,
          variantId,
          title: variant.title,
          author: variant.author,
          amazonUrl: variant.amazonUrl,
          imageUrl: variant.imageUrl || null,
          isActive: variant.isActive,
          weight: variant.weight || 100,
          createdAt: variant.createdAt,
          droppedAt: variant.droppedAt || null,
          dropReason: variant.dropReason || null,
          totalImpressions,
          totalClicks,
          overallCTR: totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00",
          dailyStats: dailyData.slice(0, 14) // Last 14 days
        });
      }
    }

    // Sort by slot, then by impressions
    stats.sort((a, b) => {
      if (a.slotId !== b.slotId) return a.slotId.localeCompare(b.slotId);
      return b.totalImpressions - a.totalImpressions;
    });

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        generatedAt: new Date().toISOString(),
        totalProducts: [...new Set(stats.map(s => s.slotId))].length,
        totalVariants: stats.length,
        stats
      })
    };
  } catch (error) {
    context.error("Error fetching stats:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to fetch stats", details: error.message })
    };
  }
}

app.http("getStats", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "stats",
  handler: getStats
});
