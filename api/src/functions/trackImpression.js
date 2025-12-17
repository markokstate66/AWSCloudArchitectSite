const { app } = require("@azure/functions");
const { incrementImpression } = require("../services/tableStorage");

async function trackImpression(request, context) {
  try {
    const body = await request.json();

    if (!body.variantId) {
      return {
        status: 400,
        body: JSON.stringify({ error: "variantId is required" })
      };
    }

    await incrementImpression(body.variantId);

    context.log(`Impression tracked for variant ${body.variantId}`);

    return { status: 204 };
  } catch (error) {
    context.error("Error tracking impression:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to track impression" })
    };
  }
}

app.http("trackImpression", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "track/impression",
  handler: trackImpression
});
