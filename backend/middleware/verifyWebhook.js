const crypto = require("crypto");
// Webhook verification middleware
 
const verifyShopifyWebhook = (req, res, next) => {
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  const rawBody = req.body;

  console.log("rawBody: ", rawBody);
 
  if (!rawBody || !Buffer.isBuffer(rawBody)) {
    console.error("Invalid request body: Expected a Buffer");
    return res.status(400).send("Invalid request body");
  }
 
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  const hash = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");
 
  if (hash !== hmacHeader) {
    console.error("Webhook HMAC verification failed");
    return res.status(401).send("Unauthorized");
  }
 
  try {
    req.body = JSON.parse(rawBody.toString("utf8")); // Parse body for downstream use
    next();
  } catch (error) {
    console.error("Error parsing webhook body:", error.message);
    return res.status(400).send("Invalid JSON body");
  }
};
 
 
module.exports = {
    verifyShopifyWebhook
}