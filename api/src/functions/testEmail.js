const { app } = require("@azure/functions");
const {
  getActiveProducts,
  getActiveVariantsForSlot,
  getStatsForVariant,
  getTotalImpressions,
  getPoolCounts
} = require("../services/tableStorage");

const ACS_CONNECTION_STRING = process.env.ACS_CONNECTION_STRING || "";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "DoNotReply@awscloudarchitect.com";
const ADMIN_KEY = process.env.ADMIN_API_KEY || "aws-ab-admin-2025";

async function testEmail(request, context) {
  // Check admin key
  const authKey = request.headers.get("x-admin-key");
  if (authKey !== ADMIN_KEY) {
    return {
      status: 401,
      body: JSON.stringify({ error: "Unauthorized" })
    };
  }

  if (!ACS_CONNECTION_STRING || !NOTIFICATION_EMAIL) {
    return {
      status: 500,
      body: JSON.stringify({ error: "Email not configured", hasACS: !!ACS_CONNECTION_STRING, hasEmail: !!NOTIFICATION_EMAIL })
    };
  }

  try {
    // Lazy load email client
    const { EmailClient } = require("@azure/communication-email");
    const emailClient = new EmailClient(ACS_CONNECTION_STRING);

    // Fetch real data from database
    const products = await getActiveProducts();
    let totalImpressions = 0;
    let totalClicks = 0;
    const variants = [];

    for (const product of products) {
      const slotId = product.rowKey;
      const slotName = product.slotName || slotId;
      const slotVariants = await getActiveVariantsForSlot(slotId);

      for (const variant of slotVariants) {
        const stats = await getStatsForVariant(variant.rowKey, 7);
        const impressions = stats.reduce((sum, s) => sum + (s.impressions || 0), 0);
        const clicks = stats.reduce((sum, s) => sum + (s.clicks || 0), 0);
        const allTimeImpressions = await getTotalImpressions(variant.rowKey);
        const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : "0.00";

        totalImpressions += impressions;
        totalClicks += clicks;

        variants.push({
          slotName,
          title: variant.title,
          impressions,
          clicks,
          ctr,
          allTimeImpressions,
          weight: variant.weight || 100
        });
      }
    }

    const poolCounts = await getPoolCounts();
    const overallCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";

    const realReport = {
      date: new Date().toISOString().split('T')[0],
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr: overallCTR,
      variants,
      poolCounts
    };

    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff9900; border-bottom: 2px solid #ff9900; padding-bottom: 10px;">A/B Testing Status Report</h2>
        <p><strong>Date:</strong> ${realReport.date}</p>
        <p><strong>Last 7 Days:</strong> ${realReport.impressions.toLocaleString()} impressions, ${realReport.clicks} clicks (${realReport.ctr}% CTR)</p>

        <h3 style="color: #232f3e; margin-top: 20px;">📊 Active Variants Performance</h3>
        <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 5px; font-size: 14px;">
          <tr style="background: #232f3e; color: white;">
            <th style="padding: 10px; text-align: left;">Slot</th>
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: center;">7-Day Impr</th>
            <th style="padding: 10px; text-align: center;">Clicks</th>
            <th style="padding: 10px; text-align: center;">CTR</th>
            <th style="padding: 10px; text-align: center;">Weight</th>
          </tr>
    `;

    for (const v of realReport.variants) {
      const ctrColor = parseFloat(v.ctr) >= 2 ? '#28a745' : (parseFloat(v.ctr) < 1 ? '#dc3545' : '#666');
      html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${v.slotName}</td>
            <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${v.title.substring(0, 30)}${v.title.length > 30 ? '...' : ''}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #dee2e6;">${v.impressions}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #dee2e6;">${v.clicks}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #dee2e6; color: ${ctrColor}; font-weight: bold;">${v.ctr}%</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #dee2e6;">${v.weight}</td>
          </tr>
      `;
    }

    html += `
        </table>

        <h3 style="color: #232f3e; margin-top: 20px;">📦 Pool Status</h3>
        <p style="color: #666; font-size: 14px;">Products waiting in the pool to be tested:</p>
        <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 5px;">
          <tr style="background: #232f3e; color: white;">
            <th style="padding: 10px; text-align: left;">Slot</th>
            <th style="padding: 10px; text-align: center;">Items in Pool</th>
          </tr>
    `;

    for (const [slot, count] of Object.entries(realReport.poolCounts)) {
      const color = count === 0 ? '#dc3545' : '#28a745';
      html += `
          <tr>
            <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${slot}</td>
            <td style="padding: 8px; text-align: center; border-bottom: 1px solid #dee2e6; color: ${color}; font-weight: bold;">${count}</td>
          </tr>
      `;
    }

    html += `
        </table>

        <div style="margin-top: 30px; padding: 15px; background: #232f3e; border-radius: 5px; text-align: center;">
          <a href="https://green-water-0b250a80f.3.azurestaticapps.net/admin.html" style="color: #ff9900; text-decoration: none; font-weight: bold;">View Admin Dashboard →</a>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 20px; text-align: center;">
          AWS Cloud Architect A/B Testing System<br>
          Automated emails sent daily at 6 AM UTC when changes occur.
        </p>
      </div>
    `;

    const message = {
      senderAddress: SENDER_EMAIL,
      content: {
        subject: `A/B Testing Report: ${realReport.impressions} impressions, ${realReport.ctr}% CTR`,
        html: html
      },
      recipients: {
        to: [{ address: NOTIFICATION_EMAIL }]
      }
    };

    context.log(`Sending test email to ${NOTIFICATION_EMAIL}`);
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        message: `Test email sent to ${NOTIFICATION_EMAIL}`,
        messageId: result.id
      })
    };
  } catch (error) {
    context.error("Failed to send test email:", error);
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to send email", details: error.message })
    };
  }
}

app.http("testEmail", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "test-email",
  handler: testEmail
});
