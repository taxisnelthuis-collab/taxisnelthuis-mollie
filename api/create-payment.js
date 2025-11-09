// /api/create-payment.js

export default async function handler(req, res) {
  // Alleen POST toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, redirectUrl } = req.body || {};

    // Check of velden aanwezig zijn
    if (!amount || !description || !redirectUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Stuur betaalverzoek naar Mollie
    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: Bearer ${process.env.MOLLIE_API_KEY},
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,          // { currency: "EUR", value: "15.00" }
        description,     // bv: "Taxisnelthuis testbetaling"
        redirectUrl,     // bv: "https://alltaxisnelthuis.com/bedankt"
      }),
    });

    const data = await response.json();

    // Mollie error terug
    if (!response.ok) {
      console.error('Mollie API error:', data);
      return res.status(response.status).json({
        error: 'Mollie API call failed',
        details: data,
      });
    }

    // Succes
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message,
    });
  }
}
