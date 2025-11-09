// api/create-payment.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  // Alleen POST-verzoeken toestaan
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, description, redirectUrl } = req.body;

    // Controleer of vereiste velden zijn ingevuld
    if (!amount || !description || !redirectUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Maak de Mollie API-aanvraag
    const response = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        Authorization: Bearer ${process.env.MOLLIE_API_KEY},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        description,
        redirectUrl,
      }),
    });

    const data = await response.json();

    // Controleer of Mollie een fout terugstuurt
    if (!response.ok) {
      console.error("Mollie API error:", data);
      return res.status(500).json({
        error: "Mollie API call failed",
        details: data,
      });
    }

    // Succesvolle betaling teruggeven
    return res.status(200).json(data);

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      error: "Server error",
      message: error.message,
    });
  }
}
