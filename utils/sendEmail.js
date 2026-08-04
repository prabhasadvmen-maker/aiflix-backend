const sendEmail = async ({ to, toName, subject, htmlContent }) => {
  const emailEnabled = process.env.EMAIL_ENABLED === "true";
  const useBrevo = process.env.USE_BREVO === "true";

  if (!emailEnabled || !useBrevo) {
    console.log("[EMAIL] Email sending disabled via ENV — skipping.");
    return true;
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) throw new Error("BREVO_API_KEY is not configured in .env");

  const senderEmail = process.env.BREVO_FROM_EMAIL;
  if (!senderEmail) throw new Error("BREVO_FROM_EMAIL is not configured in .env");

  const senderName = process.env.BREVO_FROM_NAME || process.env.APP_NAME || "AIflix";

  let response;
  let data;

  try {
    response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to, name: toName || to }],
        subject,
        htmlContent,
      }),
    });

    data = await response.json();
  } catch (networkErr) {
    console.error("[EMAIL] Network error reaching Brevo:", networkErr.message);
    throw new Error("Email service unreachable. Please try again later.");
  }

  // Debug log full Brevo response
  if (!response.ok) {
    console.error(`[EMAIL] Brevo error ${response.status}:`, JSON.stringify(data, null, 2));
  }

  // Handle specific Brevo error codes
  if (response.status === 401 || response.status === 403) {
    const isIpError = data?.message?.toLowerCase().includes("ip");
    if (isIpError) {
      console.error("[EMAIL] Brevo IP not authorized. Fix: https://app.brevo.com/security/authorised_ips");
      throw new Error("Email service configuration error. Please contact support.");
    }
    throw new Error("Email service authentication failed.");
  }

  if (response.status === 429) {
    console.error("[EMAIL] Brevo rate limit hit.");
    throw new Error("Too many emails sent. Please try again in a few minutes.");
  }

  if (response.status >= 500) {
    console.error("[EMAIL] Brevo server error.");
    throw new Error("Email provider is temporarily unavailable. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(data?.message || "Failed to send email.");
  }

  console.log(`[EMAIL] Sent successfully to ${to} | Subject: "${subject}"`)
  return true;
};

module.exports = sendEmail;
