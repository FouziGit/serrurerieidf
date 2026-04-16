const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_EMAIL || "contact@monartisanidf.fr";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@urgenceserrures.fr";

const MAX_BODY_SIZE = 10000; // 10 KB
const PHONE_REGEX = /^[0-9+\s\-()]{8,20}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FETCH_TIMEOUT_MS = 5000;

/** Escape HTML entities to prevent injection in email templates. */
function escapeHtml(str) {
  if (!str) return str;
  return str.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

/**
 * POST handler for contact form submission via Resend API.
 * @param {Object} event - Netlify function event (httpMethod, body)
 * @returns {Promise<{statusCode: number, body: string}>}
 * Status codes: 200 (success), 400 (validation error), 405 (non-POST), 413 (too large), 500 (Resend/server error)
 */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  if (event.body && event.body.length > MAX_BODY_SIZE) {
    return { statusCode: 413, body: JSON.stringify({ error: "Demande trop volumineuse." }) };
  }

  let parsed;
  try {
    parsed = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Format JSON invalide." }) };
  }

  try {
    const { name, phone, email, urgency, message } = parsed;

    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Nom et téléphone requis." }),
      };
    }

    if (!PHONE_REGEX.test(phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Format de téléphone invalide." }),
      };
    }

    if (email && !EMAIL_REGEX.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Format d'email invalide." }),
      };
    }

    const urgencyLabels = {
      ouverture: "Ouverture de porte (urgence)",
      cylindre: "Changement de cylindre",
      blindage: "Blindage de porte",
      serrure: "Remplacement de serrure",
      "porte-blindee": "Installation porte blindée",
      autre: "Autre demande",
    };

    const urgencyText = urgencyLabels[urgency] || escapeHtml(urgency) || "Non spécifié";
    const safeName = escapeHtml(name);
    const safePhone = escapeHtml(phone);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; color: #fff; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; color: #ff6b35;">Nouvelle demande de devis - Serrurerie</h2>
        </div>
        <div style="padding: 20px; background: #f9f9f9; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee; width: 140px;">Nom</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Téléphone</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${safePhone}">${safePhone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${safeEmail || "Non renseigné"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Intervention</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${urgencyText}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 10px;">${safeMessage || "Aucun message"}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 15px; background: #1a1a2e; color: #999; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center;">
          Email envoyé depuis urgenceserrures.fr
        </div>
      </div>
    `;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Urgence Serrures <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        subject: `[Devis Serrurerie] ${urgencyText} - ${safeName}`,
        html: htmlBody,
        reply_to: email || undefined,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error("Resend error - status:", response.status);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Erreur lors de l'envoi du message." }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Message envoyé avec succès." }),
    };
  } catch (error) {
    console.error("Contact form error:", error.name === "AbortError" ? "Request timeout" : "Processing failed");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur." }),
    };
  }
};
