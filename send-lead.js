// /api/send-lead.js
// Vercel serverless function — receives lead form data from your website
// and forwards it as a WhatsApp message to your business number via
// Meta's WhatsApp Cloud API.
//
// SETUP:
// 1. Deploy this file inside an `api/` folder in a Vercel project
//    (Vercel auto-detects files in /api as serverless functions).
// 2. In your Vercel project settings, add these Environment Variables:
//      WHATSAPP_PHONE_NUMBER_ID   -> from Meta > WhatsApp > API Setup
//      WHATSAPP_ACCESS_TOKEN      -> your permanent access token
//      OWNER_WHATSAPP_NUMBER      -> YOUR number in international format,
//                                    no "+", e.g. 917409859114
// 3. Point your website's form submit handler to POST to:
//      https://<your-vercel-project>.vercel.app/api/send-lead
//
// NEVER put WHATSAPP_ACCESS_TOKEN in your website's HTML/JS — it must
// only exist here, as a server-side environment variable.

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic CORS handling so your site's domain can call this function.
  // Replace '*' with your actual domain once live, e.g. 'https://learners-academy.co.in'
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { name, phone, track } = req.body || {};

    // Basic validation
    if (!name || !phone || !track) {
      return res.status(400).json({ error: 'Missing required fields: name, phone, track' });
    }

    const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
    const OWNER_NUMBER = process.env.OWNER_WHATSAPP_NUMBER;

    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN || !OWNER_NUMBER) {
      console.error('Missing WhatsApp environment variables');
      return res.status(500).json({ error: 'Server is not configured correctly' });
    }

    const messageBody =
      `New demo booking on Learners Academy!\n\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Interested in: ${track}`;

    const metaResponse = await fetch(
      `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: OWNER_NUMBER,
          type: 'text',
          text: { body: messageBody }
        })
      }
    );

    const metaData = await metaResponse.json();

    if (!metaResponse.ok) {
      console.error('Meta API error:', metaData);
      return res.status(502).json({ error: 'Failed to send WhatsApp message', details: metaData });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-lead error:', err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
