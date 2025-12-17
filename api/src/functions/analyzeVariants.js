const { app } = require("@azure/functions");
const { EmailClient } = require("@azure/communication-email");
const {
  getActiveProducts,
  getActiveVariantsForSlot,
  getStatsForVariant,
  getTotalImpressions,
  calculateRollingCTR,
  updateVariantWeight,
  dropVariant,
  getRandomFromPool,
  promoteFromPool,
  getPoolCounts
} = require("../services/tableStorage");

const MIN_IMPRESSIONS = parseInt(process.env.AB_MIN_IMPRESSIONS || "50");
const MIN_DAYS = parseInt(process.env.AB_MIN_DAYS || "7");
const DROP_THRESHOLD = parseFloat(process.env.AB_DROP_THRESHOLD || "0.5");
const MIN_VARIANTS_PER_SLOT = parseInt(process.env.AB_MIN_VARIANTS || "1");
const TARGET_VARIANTS_PER_SLOT = parseInt(process.env.AB_TARGET_VARIANTS || "2");

// Email configuration
const ACS_CONNECTION_STRING = process.env.ACS_CONNECTION_STRING || "";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "DoNotReply@e57d08f2-19aa-4d8b-a7d1-f94a39c4065a.azurecomm.net";

// Send email notification
async function sendNotification(subject, htmlBody, context) {
  if (!ACS_CONNECTION_STRING || !NOTIFICATION_EMAIL) {
    context.log("Email not configured, skipping notification");
    return;
  }

  try {
    const emailClient = new EmailClient(ACS_CONNECTION_STRING);

    const message = {
      senderAddress: SENDER_EMAIL,
      content: {
        subject: subject,
        html: htmlBody
      },
      recipients: {
        to: [{ address: NOTIFICATION_EMAIL }]
      }
    };

    const poller = await emailClient.beginSend(message);
    await poller.pollUntilDone();
    context.log(`Email sent: ${subject}`);
  } catch (error) {
    context.error("Failed to send email:", error.message);
  }
}

function daysSince(dateString) {
  const created = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

async function analyzeVariants(myTimer, context) {
  context.log("Starting daily A/B variant analysis");

  // Track changes for email notification
  const changes = {
    dropped: [],
    promoted: [],
    totalImpressions: 0,
    totalClicks: 0
  };

  try {
    const products = await getActiveProducts();
    context.log(`Found ${products.length} active product slots`);

    // First pass: check if there were any impressions at all
    let hadAnyImpressions = false;
    for (const product of products) {
      const slotId = product.rowKey;
      const variants = await getActiveVariantsForSlot(slotId);

      for (const variant of variants) {
        const stats = await getStatsForVariant(variant.rowKey, 1); // Last 1 day
        const recentImpressions = stats.reduce((sum, s) => sum + (s.impressions || 0), 0);
        const recentClicks = stats.reduce((sum, s) => sum + (s.clicks || 0), 0);
        changes.totalImpressions += recentImpressions;
        changes.totalClicks += recentClicks;
        if (recentImpressions > 0) {
          hadAnyImpressions = true;
        }
      }
    }

    // Skip analysis if no visitors in the last day
    if (!hadAnyImpressions) {
      context.log("No impressions in the last 24 hours - skipping analysis");
      return;
    }

    context.log(`Found ${changes.totalImpressions} impressions and ${changes.totalClicks} clicks in last 24 hours`);

    // Main analysis loop
    for (const product of products) {
      const slotId = product.rowKey;
      const slotName = product.slotName || slotId;
      const variants = await getActiveVariantsForSlot(slotId);

      context.log(`Slot ${slotId}: ${variants.length} active variants`);

      if (variants.length <= 1) {
        context.log(`Skipping slot ${slotId} - need at least 2 variants to compare`);

        // Still check if we need to add from pool
        if (variants.length < TARGET_VARIANTS_PER_SLOT) {
          const needed = TARGET_VARIANTS_PER_SLOT - variants.length;
          const poolItems = await getRandomFromPool(slotId, needed);
          for (const poolItem of poolItems) {
            const newVariantId = await promoteFromPool(slotId, poolItem);
            context.log(`Promoted from pool: "${poolItem.title}" as ${newVariantId}`);
            changes.promoted.push({
              slotName,
              title: poolItem.title,
              variantId: newVariantId
            });
          }
        }
        continue;
      }

      // Analyze each variant
      const analyses = await Promise.all(
        variants.map(async (variant) => {
          const stats = await getStatsForVariant(variant.rowKey, 7);
          const impressions = await getTotalImpressions(variant.rowKey);
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
        if (activeCount <= 1) break;

        if (analysis.ctr < dropThresholdCTR) {
          const reason = `CTR ${analysis.ctr.toFixed(2)}% below threshold ${dropThresholdCTR.toFixed(2)}%`;
          context.log(`Dropping variant ${analysis.variant.rowKey}: ${reason}`);
          await dropVariant(slotId, analysis.variant.rowKey, reason);
          activeCount--;

          changes.dropped.push({
            slotName,
            title: analysis.variant.title,
            ctr: analysis.ctr.toFixed(2),
            reason
          });
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
          await updateVariantWeight(slotId, analysis.variant.rowKey, newWeight);
          context.log(`Updated weight for ${analysis.variant.rowKey}: ${newWeight}`);
        }
      }

      // Auto-promote from pool if below target variants
      const currentVariantCount = remainingVariants.length;
      if (currentVariantCount < TARGET_VARIANTS_PER_SLOT) {
        const needed = TARGET_VARIANTS_PER_SLOT - currentVariantCount;
        context.log(`Slot ${slotId}: Need ${needed} more variants, checking pool...`);

        const poolItems = await getRandomFromPool(slotId, needed);
        for (const poolItem of poolItems) {
          const newVariantId = await promoteFromPool(slotId, poolItem);
          context.log(`Promoted from pool: "${poolItem.title}" as ${newVariantId}`);
          changes.promoted.push({
            slotName,
            title: poolItem.title,
            variantId: newVariantId
          });
        }

        if (poolItems.length === 0) {
          context.log(`Slot ${slotId}: No items in pool to promote`);
        }
      }
    }

    // Log pool status
    const poolCounts = await getPoolCounts();
    context.log("Pool status:", JSON.stringify(poolCounts));

    // Send email notification if there were changes
    if (changes.dropped.length > 0 || changes.promoted.length > 0) {
      const subject = `A/B Testing Update: ${changes.dropped.length} dropped, ${changes.promoted.length} promoted`;

      let html = `
        <h2>Daily A/B Testing Report</h2>
        <p><strong>Date:</strong> ${new Date().toISOString().split('T')[0]}</p>
        <p><strong>Last 24 Hours:</strong> ${changes.totalImpressions} impressions, ${changes.totalClicks} clicks</p>
      `;

      if (changes.dropped.length > 0) {
        html += `<h3>Dropped Variants (${changes.dropped.length})</h3><ul>`;
        for (const d of changes.dropped) {
          html += `<li><strong>${d.slotName}:</strong> "${d.title}" - CTR: ${d.ctr}%</li>`;
        }
        html += `</ul>`;
      }

      if (changes.promoted.length > 0) {
        html += `<h3>Promoted from Pool (${changes.promoted.length})</h3><ul>`;
        for (const p of changes.promoted) {
          html += `<li><strong>${p.slotName}:</strong> "${p.title}"</li>`;
        }
        html += `</ul>`;
      }

      html += `<h3>Pool Status</h3><ul>`;
      for (const [slot, count] of Object.entries(poolCounts)) {
        html += `<li>${slot}: ${count} items waiting</li>`;
      }
      html += `</ul>`;

      html += `<p><a href="https://green-water-0b250a80f.3.azurestaticapps.net/admin.html">View Admin Dashboard</a></p>`;

      await sendNotification(subject, html, context);
    }

    context.log("A/B variant analysis completed");
  } catch (error) {
    context.error("Error in variant analysis:", error);

    // Send error notification
    await sendNotification(
      "A/B Testing Error",
      `<h2>Error in Daily Analysis</h2><p>${error.message}</p><pre>${error.stack}</pre>`,
      context
    );

    throw error;
  }
}

app.timer("analyzeVariants", {
  schedule: "0 0 6 * * *", // 6 AM UTC daily
  handler: analyzeVariants
});
