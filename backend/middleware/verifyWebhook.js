const getRawBody = require('raw-body');
const crypto = require ('crypto'); 

exports.verifyShopifyWebhook = async (req, res,next)=> {
    console.log('verifyWebhook');
    const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
    console.log('secret',secret);
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    console.log('hmacHeader',hmacHeader);
    const rawBody = req.body;
    console.log('rawBody',rawBody);
  
    if (!Buffer.isBuffer(rawBody)) {
    console.error('Invalid body format');
      return res.status(400).send('Invalid body format');
    }
  
    const generatedHash = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');

    console.log('generatedHash',generatedHash);
  
    if (generatedHash !== hmacHeader) {
      return res.status(401).send('Unauthorized');
    }
    
    console.log('req.body',req.body);
    try {
      req.body = JSON.parse(rawBody.toString('utf8'));
      next();
    } catch (err) {
      console.error('JSON Parse Error:', err.message);
      return res.status(400).send('Invalid JSON');
    }  
}
