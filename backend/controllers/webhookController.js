const crypto = require('crypto');
const getRawBody = require('raw-body');
const fs = require('fs').promises;
const path = require('path');

exports.OrderWebhook = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
    if (!hmacHeader) {
      console.error('Missing X-Shopify-Hmac-Sha256 header');
      return res.status(401).send('Unauthorized: Missing HMAC header');
    }

    const rawBody = await getRawBody(req);
    const bodyString = rawBody.toString('utf8');

    // HMAC Verification
    const isVerified = verifyWebhook(bodyString, hmacHeader);
    if (!isVerified) {
      console.error('HMAC verification failed');
      return res.status(401).send('Unauthorized: Invalid HMAC');
    }

    // Parse JSON Payload
    let parsedData;
    try {
      parsedData = JSON.parse(bodyString);
    } catch (err) {
      console.error('Invalid JSON payload:', err.message);
      return res.status(400).send('Invalid JSON payload');
    }

    // Save to File
    try {
      const filePath = path.join(__dirname, 'webhook_data.txt');
      const dataToSave = JSON.stringify(parsedData, null, 2) + '\n\n';
      await fs.appendFile(filePath, dataToSave);
      console.log('Webhook data saved to:', filePath);
    } catch (fileErr) {
      console.error('Error saving webhook data:', fileErr.message);
      return res.status(500).send('Error saving data');
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    console.error('Unexpected webhook error:', err.message);
    res.status(500).send('Internal Server Error');
  }
};

function verifyWebhook(payload, hmacHeader) {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET || '';
  if (!secret) {
    console.error('SHOPIFY_WEBHOOK_SECRET not configured');
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
    console.error('HMAC comparison failed:', err.message);
    return false;
  }
}
