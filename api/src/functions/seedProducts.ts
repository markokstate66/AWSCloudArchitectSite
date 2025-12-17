import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { createProduct, createVariant } from "../services/tableStorage";

interface SeedVariant {
  title: string;
  author: string;
  description: string;
  amazonUrl: string;
  imageUrl?: string;
  tags: string[];
}

interface SeedRequest {
  products: {
    slotId: string;
    slotName: string;
    variants: SeedVariant[];
  }[];
}

const ADMIN_KEY = process.env.ADMIN_API_KEY || "aws-ab-admin-2025";

function generateVariantId(): string {
  return "var-" + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export async function seedProducts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Check admin key
  const authKey = request.headers.get("x-admin-key");
  if (authKey !== ADMIN_KEY) {
    return {
      status: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  try {
    const body = await request.json() as SeedRequest;

    if (!body.products || !Array.isArray(body.products)) {
      return {
        status: 400,
        body: JSON.stringify({ error: "products array is required" })
      };
    }

    let productsCreated = 0;
    let variantsCreated = 0;

    for (const product of body.products) {
      try {
        await createProduct(product.slotId, product.slotName);
        productsCreated++;
        context.log(`Created product slot: ${product.slotId}`);
      } catch (error: any) {
        if (error.statusCode !== 409) { // Ignore if already exists
          throw error;
        }
        context.log(`Product slot ${product.slotId} already exists`);
      }

      for (const variant of product.variants) {
        const variantId = generateVariantId();
        await createVariant(product.slotId, variantId, variant);
        variantsCreated++;
        context.log(`Created variant: ${variantId} for slot ${product.slotId}`);
      }
    }

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        productsCreated,
        variantsCreated
      })
    };
  } catch (error) {
    context.error("Error seeding products:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to seed products" })
    };
  }
}

app.http("seedProducts", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "admin/seed",
  handler: seedProducts
});
