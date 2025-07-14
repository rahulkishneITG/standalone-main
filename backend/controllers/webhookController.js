const crypto = require('crypto');
const getRawBody = require('raw-body');
const fs = require('fs').promises;
const path = require('path');
 
exports.OrderWebhook = async (req, res) => {
 
    console.log(req.body);
 
    try {
 
        // if (req.method !== 'POST') {
        //     return res.status(405).send('Method Not Allowed');
        // }
 
        // const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
 
        // if (!hmacHeader) {
        //     console.error('Missing X-Shopify-Hmac-Sha256 header');
        //     return res.status(401).send('Unauthorized: Missing HMAC header');
        // }
 
        // const webhookData = (await getRawBody(req)).toString('utf8');
 
       
        // let parsedData;
 
        // try {
 
        //     parsedData = JSON.parse(webhookData);
        //     console.log("parsedData :-",parsedData);
        // } catch (err) {
 
        //     console.error('Invalid JSON payload:', err.message);
        //     return res.status(400).send('Invalid JSON payload');
 
        // }
 
        // const verified = verifyShopifyWebhook(webhookData, hmacHeader);
 
        // if (!verified) {
 
        //     console.error('HMAC verification failed');
        //     return res.status(401).send('Unauthorized: Invalid HMAC');
 
        // }
 
     
        // try {
 
        //     const filePath = path.join(__dirname, 'webhook_data.txt');
        //     const dataToSave = JSON.stringify(parsedData, null, 2) + '\n\n';
        //     await fs.appendFile(filePath, dataToSave);
        //     console.log('Webhook data saved to:', filePath);
 
        // } catch (fileErr) {
 
        //     console.error('Error saving webhook data to file:', fileErr.message);
         
        // }
 
        // res.status(200).send('Webhook received');
 
    } catch (err) {
 
        console.error('Webhook error:', err.message);
        res.status(500).send('Internal Server Error');
 
    }
};