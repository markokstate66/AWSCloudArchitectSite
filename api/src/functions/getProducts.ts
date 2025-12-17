import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { getActiveProducts, getActiveVariantsForSlot, selectVariantWeighted, Variant } from "../services/tableStorage";

interface ProductResponse {
  slotId: string;
  variantId: string;
  title: string;
  author: string;
  description: string;
  amazonUrl: string;
  imageUrl: string | null;
  tags: string[];
}

export async function getProducts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log("getProducts function processing request");

  try {
    const products = await getActiveProducts();
    const response: ProductResponse[] = [];

    for (const product of products) {
      const slotId = product.rowKey as string;
      const variants = await getActiveVariantsForSlot(slotId);

      if (variants.length === 0) {
        context.log(`No active variants for slot ${slotId}`);
        continue;
      }

      const selected = selectVariantWeighted(variants);

      response.push({
        slotId,
        variantId: selected.rowKey as string,
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
