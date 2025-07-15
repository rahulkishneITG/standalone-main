const axios = require('axios');

module.exports = async function syncProduct(req, res) {
  try {
    const { q = '' } = req.query;

    const baseUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2025-07/products.json?limit=250`;
    const headers = {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
    };

    let allProducts = [];
    let nextPageUrl = baseUrl;

    while (nextPageUrl) {
      const response = await axios.get(nextPageUrl, { headers });

      const products = response.data.products || [];
      allProducts = [...allProducts, ...products];

      // Check for next page from Link header
      const linkHeader = response.headers.link;
      if (linkHeader && linkHeader.includes('rel="next"')) {
        const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        nextPageUrl = match ? match[1] : null;
      } else {
        nextPageUrl = null;
      }
    }

    // Filter by title search
    const filtered = allProducts.filter((p) =>
      p.title.toLowerCase().includes(q.toLowerCase())
    );

    const products = filtered.map((p) => ({
      id: p.id,
      title: p.title,
    }));

    res.json({ products });
  } catch (error) {
    console.error('Error syncing products:', error.message);
    res.status(500).json({ message: 'Failed to fetch products from Shopify' });
  }
};
