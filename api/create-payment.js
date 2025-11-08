// api/create-payment.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // Alleen POST-toegang toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Gegevens uit de aanvraag-body halen
    const { amount, description, redirectUrl } = req.body;

    // Mollie API-aanvraag versturen
    const response = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: Bearer ${process.env.MOLLIE_API_KEY},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: amount, // bijvoorbeeld "15.00"
        },
        description,
        redirectUrl,
      }),
    });

    // API-antwoord uitlezen
    const data = await response.json();

    // Fout van Mollie doorgeven als er iets misgaat
    if (!response.ok) {
      console.error("Mollie API error:", data);
      return res.status(response.status).json(data);
    }

    // Succesvolle betaling aan frontend teruggeven
    return res.status(200).json(data);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: error.message });
  }
}
