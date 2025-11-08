// api/create-payment.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, description, redirectUrl } = req.body;

    const response = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        "Authorization": Bearer ${process.env.MOLLIE_API_KEY},
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: amount.toFixed(2),
        },
        description,
        redirectUrl,
      }),
    });

    const data = await response.json();

    if (data._links && data._links.checkout) {
      res.status(200).json({ paymentUrl: data._links.checkout.href });
    } else {
      res.status(400).json({ error: "Payment creation failed", details: data });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
}
