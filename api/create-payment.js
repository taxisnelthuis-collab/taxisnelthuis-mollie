// /api/create-payment.js
export default async function handler(req, res) {
  // Alleen POST toestaan
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, description, redirectUrl } = req.body || {};

    // Verplichte velden
    if (!amount || !description || !redirectUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Aanvraag naar Mollie (gebruik Node 18 global fetch)
    const response = await fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: Bearer ${process.env.MOLLIE_API_KEY},
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // let op: "value" MOET string zijn met 2 decimalen
        amount,         // bijv. { "currency":"EUR", "value":"15.00" }
        description,    // bijv. "Taxisnelthuis testbetaling"
        redirectUrl,    // bijv. "https://alltaxisnelthuis.com/bedankt"
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Mollie API error:', data);
      return res.status(response.status).json({
        error: 'Mollie API call failed',
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error', message: err.message });
  }
}
