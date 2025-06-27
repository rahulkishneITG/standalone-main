export const searchProducts = async (query) => {
    // Replace with actual API
    return [
      { id: '1', title: 'Product A' },
      { id: '2', title: 'Product B' },
      { id: '3', title: 'Product C' },
    ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  };