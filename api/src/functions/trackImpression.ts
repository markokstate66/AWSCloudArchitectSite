import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { incrementImpression } from "../services/tableStorage";

interface TrackRequest {
  variantId: string;
  slotId: string;
  sessionId?: string;
  page?: string;
}

export async function trackImpression(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const body = await request.json() as TrackRequest;

    if (!body.variantId) {
      return {
        status: 400,
        body: JSON.stringify({ error: "variantId is required" })
      };
    }

    await incrementImpression(body.variantId);

    context.log(`Impression tracked for variant ${body.variantId}`);

    return {
      status: 204
    };
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
