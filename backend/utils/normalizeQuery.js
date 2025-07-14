
module.exports = (queryParams) => {
  const normalized = { ...queryParams };

  console.log('normalized',normalized);

  if (normalized.registration_type && !Array.isArray(normalized.registration_type)) {
    normalized.registration_type = [normalized.registration_type];
  }
  if (normalized.is_paid && !Array.isArray(normalized.is_paid)) {
    normalized.is_paid = [normalized.is_paid];
  }

  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalized[key].trim();
    } else if (Array.isArray(normalized[key])) {
      normalized[key] = normalized[key].map((v) => (typeof v === 'string' ? v.trim() : v));
    }
  });

  return normalized;
};