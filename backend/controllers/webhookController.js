const crypto = require('crypto');
const getRawBody = require('raw-body');
const fs = require('fs').promises;
const path = require('path');

exports.OrderWebhook = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  if (!hmacHeader) {
    console.error('Missing HMAC header');
    return res.status(401).send('Unauthorized: HMAC header missing');
  }

  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('Failed to read raw body:', err.message);
    return res.status(400).send('Invalid body');
  }

  const bodyString = rawBody.toString('utf8');
  const isVerified = verifyWebhook(bodyString, hmacHeader);

  if (!isVerified) {
    console.error('HMAC verification failed');
    return res.status(401).send('Unauthorized: Invalid HMAC');
  }

  let parsedData;
  try {
    parsedData = JSON.parse(bodyString);
  } catch (err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).send('Invalid JSON');
  }

  try {
    const filePath = path.join(__dirname, 'webhook_data.txt');
    await fs.appendFile(filePath, JSON.stringify(parsedData, null, 2) + '\n\n');
    console.log('Webhook data saved:', filePath);
  } catch (err) {
    console.error('Failed to save webhook data:', err.message);
    return res.status(500).send('Server Error: Could not save data');
  }

  res.status(200).send('Webhook received');
};

function verifyWebhook(payload, hmacHeader) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) {
    console.error('Missing SHOPIFY_WEBHOOK_SECRET');
    return false;
  }

  const generatedHmac = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac, 'base64'),
      Buffer.from(hmacHeader, 'base64')
    );
  } catch (err) {
    console.error('HMAC comparison error:', err.message);
    return false;
  }
}
