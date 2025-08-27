// Vercel Serverless Function for WhatsApp Webhook
// Follows Meta docs: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started#configure-webhooks

const VERIFY_TOKEN = 'khadum_webhook_verify_token_2024';

export default async function handler(req: any, res: any) {
  // Webhook Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return res.status(200).send(challenge);
    }
    return res.status(403).send('Forbidden');
  }

  // Webhook Events (POST)
  if (req.method === 'POST') {
    // Per Meta docs, always 200 OK quickly then process async
    try {
      const body = req.body || {};
      // minimal validation
      if (body.object !== 'whatsapp_business_account') {
        return res.status(404).send('Not a WhatsApp webhook');
      }
      // Optionally log
      console.log('[WHATSAPP WEBHOOK]', JSON.stringify(body));
      return res.status(200).send('OK');
    } catch (e) {
      console.error('Webhook error:', e);
      return res.status(200).send('OK');
    }
  }

  return res.status(405).send('Method Not Allowed');
}


