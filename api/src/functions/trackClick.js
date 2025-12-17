const { app } = require("@azure/functions");
const { incrementClick } = require("../services/tableStorage");

async function trackClick(request, context) {
  try {
    const body = await request.json();

    if (!body.variantId) {
      return {
        status: 400,
        body: JSON.stringify({ error: "variantId is required" })
      };
    }

    await incrementClick(body.variantId);

    context.log(`Click tracked for variant ${body.variantId}`);

    return { status: 204 };
  } catch (error) {
    context.error("Error tracking click:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to track click" })
    };
  }
}

app.http("trackClick", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "track/click",
  handler: trackClick
});
