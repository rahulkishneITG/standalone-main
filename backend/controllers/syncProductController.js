const axios = require('axios');

module.exports = async function syncProduct(req, res){
    try {
      const { q } = req.query;
      console.log('Received query:', q);
     
      const url = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-04/products.json?limit=250`;
      console.log('Shopify API URL:', url);
  
      const response = await axios.get(url, {
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
        },
      });
  
      const filtered = response.data.products.filter((p) =>
        p.title.toLowerCase().includes(q.toLowerCase())
      );
  
      const products = filtered.map((p) => ({
        id: p.id,
        title: p.title,
      }));
  
      res.json({ products });
    } catch (error) {
      console.error('Shopify product search failed:', error.message);
      res.status(500).json({ message: 'Failed to fetch products from Shopify' });
    }
  };
  