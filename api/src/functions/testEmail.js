const { app } = require("@azure/functions");

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

    // Sample data that mimics a real daily report
    const sampleReport = {
      date: new Date().toISOString().split('T')[0],
      impressions: 1247,
      clicks: 43,
      dropped: [
        { slotName: "DevOps Culture", title: "The Phoenix Project", ctr: "1.2" },
        { slotName: "Clean Code", title: "Clean Code: A Handbook of Agile Software Craftsmanship", ctr: "0.8" }
      ],
      promoted: [
        { slotName: "DevOps Culture", title: "The Unicorn Project" },
        { slotName: "Clean Code", title: "The Pragmatic Programmer" }
      ],
      poolCounts: {
        "slot-1": 1,
        "slot-2": 0,
        "slot-3": 2,
        "slot-4": 0,
        "slot-5": 1,
        "slot-6": 1,
        "slot-7": 0,
        "slot-8": 1
      }
    };

    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff9900; border-bottom: 2px solid #ff9900; padding-bottom: 10px;">Daily A/B Testing Report</h2>
        <p><strong>Date:</strong> ${sampleReport.date}</p>
        <p><strong>Last 24 Hours:</strong> ${sampleReport.impressions.toLocaleString()} impressions, ${sampleReport.clicks} clicks (${((sampleReport.clicks/sampleReport.impressions)*100).toFixed(2)}% CTR)</p>

        <h3 style="color: #dc3545; margin-top: 20px;">🔻 Dropped Variants (${sampleReport.dropped.length})</h3>
        <p style="color: #666; font-size: 14px;">These products performed below 50% of slot average CTR and have been removed from rotation.</p>
        <ul style="background: #fff5f5; padding: 15px 30px; border-radius: 5px;">
    `;

    for (const d of sampleReport.dropped) {
      html += `<li style="margin: 8px 0;"><strong>${d.slotName}:</strong> "${d.title}" - CTR: ${d.ctr}%</li>`;
    }

    html += `
        </ul>

        <h3 style="color: #28a745; margin-top: 20px;">🔺 Promoted from Pool (${sampleReport.promoted.length})</h3>
        <p style="color: #666; font-size: 14px;">These products were randomly selected from the pool to replace dropped variants.</p>
        <ul style="background: #f0fff0; padding: 15px 30px; border-radius: 5px;">
    `;

    for (const p of sampleReport.promoted) {
      html += `<li style="margin: 8px 0;"><strong>${p.slotName}:</strong> "${p.title}"</li>`;
    }

    html += `
        </ul>

        <h3 style="color: #232f3e; margin-top: 20px;">📦 Pool Status</h3>
        <p style="color: #666; font-size: 14px;">Products waiting in the pool to be tested:</p>
        <table style="width: 100%; border-collapse: collapse; background: #f8f9fa; border-radius: 5px;">
          <tr style="background: #232f3e; color: white;">
            <th style="padding: 10px; text-align: left;">Slot</th>
            <th style="padding: 10px; text-align: center;">Items in Pool</th>
          </tr>
    `;

    for (const [slot, count] of Object.entries(sampleReport.poolCounts)) {
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
          This is a TEST email from your AWS Cloud Architect A/B Testing System.<br>
          Real emails will be sent daily at 6 AM UTC when changes occur.
        </p>
      </div>
    `;

    const message = {
      senderAddress: SENDER_EMAIL,
      content: {
        subject: "TEST: A/B Testing Update - 2 dropped, 2 promoted",
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
