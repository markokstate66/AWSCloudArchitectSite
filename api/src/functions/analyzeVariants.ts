import { app, InvocationContext, Timer } from "@azure/functions";
import {
  getActiveProducts,
  getActiveVariantsForSlot,
  getStatsForVariant,
  getTotalImpressions,
  calculateRollingCTR,
  updateVariantWeight,
  dropVariant,
  Variant
} from "../services/tableStorage";

const MIN_IMPRESSIONS = parseInt(process.env.AB_MIN_IMPRESSIONS || "50");
const MIN_DAYS = parseInt(process.env.AB_MIN_DAYS || "7");
const DROP_THRESHOLD = parseFloat(process.env.AB_DROP_THRESHOLD || "0.5");

interface VariantAnalysis {
  variant: Variant;
  ctr: number;
  impressions: number;
  daysActive: number;
  eligible: boolean;
}

function daysSince(dateString: string): number {
  const created = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export async function analyzeVariants(myTimer: Timer, context: InvocationContext): Promise<void> {
  context.log("Starting daily A/B variant analysis");

  try {
    const products = await getActiveProducts();
    context.log(`Found ${products.length} active product slots`);

    for (const product of products) {
      const slotId = product.rowKey as string;
      const variants = await getActiveVariantsForSlot(slotId);

      context.log(`Slot ${slotId}: ${variants.length} active variants`);

      if (variants.length <= 1) {
        context.log(`Skipping slot ${slotId} - need at least 2 variants to compare`);
        continue;
      }

      // Analyze each variant
      const analyses: VariantAnalysis[] = await Promise.all(
        variants.map(async (variant) => {
          const stats = await getStatsForVariant(variant.rowKey as string, 7);
          const impressions = await getTotalImpressions(variant.rowKey as string);
          const ctr = calculateRollingCTR(stats);
          const daysActive = daysSince(variant.createdAt);

          return {
            variant,
            ctr,
            impressions,
            daysActive,
            eligible: impressions >= MIN_IMPRESSIONS && daysActive >= MIN_DAYS
          };
        })
      );

      // Filter to eligible variants
      const eligible = analyses.filter(a => a.eligible);

      if (eligible.length < 2) {
        context.log(`Slot ${slotId}: Not enough eligible variants for comparison`);
        continue;
      }

      // Calculate average CTR
      const avgCTR = eligible.reduce((sum, a) => sum + a.ctr, 0) / eligible.length;
      const dropThresholdCTR = avgCTR * DROP_THRESHOLD;

      context.log(`Slot ${slotId}: Average CTR = ${avgCTR.toFixed(2)}%, Drop threshold = ${dropThresholdCTR.toFixed(2)}%`);

      // Check for variants to drop
      let activeCount = variants.length;
      for (const analysis of eligible) {
        if (activeCount <= 1) break; // Keep at least one variant

        if (analysis.ctr < dropThresholdCTR) {
          const reason = `CTR ${analysis.ctr.toFixed(2)}% below threshold ${dropThresholdCTR.toFixed(2)}%`;
          context.log(`Dropping variant ${analysis.variant.rowKey}: ${reason}`);
          await dropVariant(slotId, analysis.variant.rowKey as string, reason);
          activeCount--;
        }
      }

      // Adjust weights for remaining variants
      const remainingVariants = await getActiveVariantsForSlot(slotId);
      if (remainingVariants.length > 0) {
        const remainingAnalyses = analyses.filter(
          a => remainingVariants.some(v => v.rowKey === a.variant.rowKey)
        );

        const maxCTR = Math.max(...remainingAnalyses.map(a => a.ctr), 0.01);

        for (const analysis of remainingAnalyses) {
          const normalizedScore = analysis.ctr / maxCTR;
          const newWeight = Math.round(50 + normalizedScore * 100);
          await updateVariantWeight(slotId, analysis.variant.rowKey as string, newWeight);
          context.log(`Updated weight for ${analysis.variant.rowKey}: ${newWeight}`);
        }
      }
    }

    context.log("A/B variant analysis completed");
  } catch (error) {
    context.error("Error in variant analysis:", error);
    throw error;
  }
}

app.timer("analyzeVariants", {
  schedule: "0 0 6 * * *", // 6 AM UTC daily
  handler: analyzeVariants
});
