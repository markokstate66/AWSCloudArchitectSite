const { app } = require("@azure/functions");

const ACS_CONNECTION_STRING = process.env.ACS_CONNECTION_STRING || "";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "DoNotReply@awscloudarchitect.com";

async function contactForm(request, context) {
  // Handle CORS preflight
  if (request.method === "OPTIONS") {
    return {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
      }
    };
  }

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  };

  // Validate configuration
  if (!ACS_CONNECTION_STRING || !NOTIFICATION_EMAIL) {
    context.error("Email service not configured");
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Email service not configured" })
    };
  }

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "All fields are required" })
      };
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        status: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Invalid email address" })
      };
    }

    // Sanitize inputs (basic XSS prevention)
    const sanitize = (str) => str.replace(/[<>]/g, '');
    const safeName = sanitize(name).substring(0, 100);
    const safeEmail = sanitize(email).substring(0, 100);
    const safeSubject = sanitize(subject).substring(0, 200);
    const safeMessage = sanitize(message).substring(0, 5000);

    // Build email HTML
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff9900; border-bottom: 2px solid #ff9900; padding-bottom: 10px;">New Contact Form Submission</h2>

        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; background: #f5f5f5; font-weight: bold; width: 100px;">From:</td>
            <td style="padding: 10px;">${safeName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">Email:</td>
            <td style="padding: 10px;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f5f5f5; font-weight: bold;">Subject:</td>
            <td style="padding: 10px;">${safeSubject}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding: 20px; background: #f9f9f9; border-left: 4px solid #ff9900;">
          <h3 style="margin-top: 0; color: #232f3e;">Message:</h3>
          <p style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
        </div>

        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
          Sent from AWS Cloud Architect Guide contact form<br>
          ${new Date().toISOString()}
        </p>
      </div>
    `;

    // Send email
    const { EmailClient } = require("@azure/communication-email");
    const emailClient = new EmailClient(ACS_CONNECTION_STRING);

    const emailMessage = {
      senderAddress: SENDER_EMAIL,
      content: {
        subject: `Contact Form: ${safeSubject}`,
        html: html
      },
      recipients: {
        to: [{ address: NOTIFICATION_EMAIL }]
      },
      replyTo: [{ address: safeEmail, displayName: safeName }]
    };

    context.log(`Sending contact form email from ${safeEmail}`);
    const poller = await emailClient.beginSend(emailMessage);
    await poller.pollUntilDone();

    return {
      status: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true, message: "Message sent successfully" })
    };

  } catch (error) {
    context.error("Contact form error:", error);
    return {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Failed to send message. Please try again later." })
    };
  }
}

app.http("contactForm", {
  methods: ["POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "contact",
  handler: contactForm
});
