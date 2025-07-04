const crypto = require('crypto');
const getRawBody = require('raw-body');


exports.OrderWebhook = async (req, res) => {
    try {
        const hmacHeader = req.get('X-Shopify-Hmac-Sha256');

        const webhookData = (await getRawBody(req)).toString('utf8');

        const verified = verifyWebhook(webhookData, hmacHeader);

       

        if (!verified) {
            return res.status(401).send('Unauthorized: Invalid HMAC');
        }

        res.status(200).send('Webhook received');
    } catch (err) {
       
        res.status(500).send('Internal Server Error');
    }
};

function verifyWebhook(webhookData, hmacHeader) {
    const sharedSecret = 'ef84e790cf05349185fe185f5c323f681b3bd7a61968ea1835f78a6cb33e6288';

    const calculatedHmac = crypto
        .createHmac('sha256', sharedSecret)
        .update(webhookData, 'utf8')
        .digest('base64');

    try {
        return crypto.timingSafeEqual(
            Buffer.from(calculatedHmac, 'utf8'),
            Buffer.from(hmacHeader, 'utf8')
        );
    } catch (e) {
        return false;
    }
}
