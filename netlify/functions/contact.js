const RESEND_API_KEY = process.env.RESEND_API_KEY;
const TO_EMAIL = process.env.CONTACT_EMAIL || "contact@monartisanidf.fr";
const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@monartisanidf.fr";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { name, phone, email, urgency, message } = JSON.parse(event.body);

    if (!name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Nom et téléphone requis." }),
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

    const urgencyText = urgencyLabels[urgency] || urgency || "Non spécifié";

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; color: #fff; padding: 20px; border-radius: 8px 8px 0 0;">
          <h2 style="margin: 0; color: #ff6b35;">Nouvelle demande de devis - Serrurerie</h2>
        </div>
        <div style="padding: 20px; background: #f9f9f9; border: 1px solid #eee;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee; width: 140px;">Nom</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Téléphone</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="tel:${phone}">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Email</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${email || "Non renseigné"}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #eee;">Intervention</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${urgencyText}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; vertical-align: top;">Message</td>
              <td style="padding: 10px;">${message || "Aucun message"}</td>
            </tr>
          </table>
        </div>
        <div style="padding: 15px; background: #1a1a2e; color: #999; border-radius: 0 0 8px 8px; font-size: 12px; text-align: center;">
          Email envoyé depuis urgenceserrures.fr
        </div>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Urgence Serrures <${FROM_EMAIL}>`,
        to: [TO_EMAIL],
        subject: `[Devis Serrurerie] ${urgencyText} - ${name}`,
        html: htmlBody,
        reply_to: email || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Resend error:", errorData);
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
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erreur serveur." }),
    };
  }
};
