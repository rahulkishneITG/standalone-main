const Test = require('../models/test.model');

exports.OrderWebhook = async (req, res) => {
    console.log('OrderWebhook called1');
  console.log('📩 OrderWebhook HIT');
  console.log('✅ Parsed body from middleware:', req.body);

  try {
    const doc = new Test({ name: 'rahul' }); 
    await doc.save();
    console.log('✅ New Document:', doc);
    res.status(200).send('Webhook processed');
  } catch (err) {
    console.error('❌ Save error:', err.message);
    res.status(500).send('Internal Server Error');
  }
};
