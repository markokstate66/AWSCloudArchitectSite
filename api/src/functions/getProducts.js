const { app } = require("@azure/functions");
const { getActiveProducts, getActiveVariantsForSlot, selectVariantWeighted } = require("../services/tableStorage");

async function getProducts(request, context) {
  context.log("getProducts function processing request");

  try {
    const products = await getActiveProducts();
    const response = [];

    for (const product of products) {
      const slotId = product.rowKey;
      const variants = await getActiveVariantsForSlot(slotId);

      if (variants.length === 0) {
        context.log(`No active variants for slot ${slotId}`);
        continue;
      }

      const selected = selectVariantWeighted(variants);

      response.push({
        slotId,
        variantId: selected.rowKey,
        title: selected.title,
        author: selected.author,
        description: selected.description,
        amazonUrl: selected.amazonUrl,
        imageUrl: selected.imageUrl || null,
        tags: JSON.parse(selected.tags || "[]")
      });
    }

    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate"
      },
      body: JSON.stringify(response)
    };
  } catch (error) {
    context.error("Error fetching products:", error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to fetch products" })
    };
  }
}

app.http("getProducts", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "products",
  handler: getProducts
});
