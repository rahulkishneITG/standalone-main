module.exports.buildFilters = (params) => {
  const query = {};

  // Search by name or email
  if (params.search) {
    query.$or = [
      { name: { $regex: params.search, $options: 'i' } },
      { email: { $regex: params.search, $options: 'i' } },
    ];
  }

  // Filter by registration_type
  if (params.registration_type && params.registration_type.length > 0) {
    const validTypes = ['Individual', 'Group'];
    const filteredTypes = params.registration_type.filter((type) => validTypes.includes(type));
    if (filteredTypes.length > 0) {
      query.registration_type = { $in: filteredTypes };
    }
  }

  // Filter by is_paid
  if (params.is_paid && params.is_paid.length > 0) {
    const validStatuses = ['yes', 'no'];
    const filteredStatuses = params.is_paid.filter((status) => validStatuses.includes(status.toLowerCase()));
    if (filteredStatuses.length > 0) {
      query.is_paid = { $in: filteredStatuses.map(status => status.toLowerCase() === 'yes' ?  true : false) };
    }
  }

  return query;
};