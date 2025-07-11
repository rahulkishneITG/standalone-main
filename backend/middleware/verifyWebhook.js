const getRawBody = require('raw-body');
const crypto = require('crypto');

exports.verifyShopifyWebhook = async (req, res, next) => {

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

  const hmacHeader = req.headers['x-shopify-hmac-sha256'];

  const rawBody = req.body;


  if (!Buffer.isBuffer(rawBody)) {
    console.error('Invalid body format');
    return res.status(400).send('Invalid body format');
  }

  const generatedHash = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');


  if (generatedHash !== hmacHeader) {
    return res.status(401).send('Unauthorized');
  }

  try {
    req.body = JSON.parse(rawBody.toString('utf8'));
    next();
  } catch (err) {
    console.error('JSON Parse Error:', err.message);
    return res.status(400).send('Invalid JSON');
  }
}
