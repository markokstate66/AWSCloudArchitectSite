const { app } = require("@azure/functions");
const { addToPool, getPoolCounts, clearPool } = require("../services/tableStorage");

const ADMIN_KEY = process.env.ADMIN_API_KEY || "aws-ab-admin-2025";

async function seedPool(request, context) {
  // Check admin key
  const authKey = request.headers.get("x-admin-key");
  if (authKey !== ADMIN_KEY) {
    return {
      status: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  try {
    const body = await request.json();
    const { products, clearExisting } = body;

    if (!products || !Array.isArray(products)) {
      return {
        status: 400,
        body: JSON.stringify({ error: "Invalid request body. Expected { products: [...] }" })
      };
    }

    // Optionally clear existing pool
    let cleared = 0;
    if (clearExisting) {
      cleared = await clearPool();
      context.log(`Cleared ${cleared} existing pool items`);
    }

    // Add products to pool
    let added = 0;
    for (const product of products) {
      if (!product.slotId || !product.title || !product.amazonUrl) {
        context.warn(`Skipping invalid product: ${JSON.stringify(product)}`);
        continue;
      }

      await addToPool(product.slotId, {
        title: product.title,
        author: product.author,
        description: product.description,
        amazonUrl: product.amazonUrl,
        imageUrl: product.imageUrl,
        tags: product.tags
      });
      added++;
    }

    // Get updated pool counts
    const poolCounts = await getPoolCounts();

    context.log(`Added ${added} products to pool`);

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        cleared,
        added,
        poolCounts
      })
    };
  } catch (error) {
    context.error("Error seeding pool:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to seed pool", details: error.message })
    };
  }
}

app.http("seedPool", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "pool/seed",
  handler: seedPool
});
