const { app } = require("@azure/functions");
const { getAllPoolItems, getPoolCounts } = require("../services/tableStorage");

async function getPool(request, context) {
  try {
    const poolItems = await getAllPoolItems();
    const poolCounts = await getPoolCounts();

    // Group by slot
    const bySlot = {};
    for (const item of poolItems) {
      const slotId = item.partitionKey;
      if (!bySlot[slotId]) {
        bySlot[slotId] = [];
      }
      bySlot[slotId].push({
        poolId: item.rowKey,
        title: item.title,
        author: item.author,
        description: item.description,
        amazonUrl: item.amazonUrl,
        imageUrl: item.imageUrl,
        tags: JSON.parse(item.tags || "[]"),
        addedAt: item.addedAt
      });
    }

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        totalItems: poolItems.length,
        countsBySlot: poolCounts,
        itemsBySlot: bySlot
      })
    };
  } catch (error) {
    context.error("Error fetching pool:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to fetch pool", details: error.message })
    };
  }
}

app.http("getPool", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "pool",
  handler: getPool
});
