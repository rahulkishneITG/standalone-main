const mongoose = require('mongoose');
  
exports.buildFilters = (queryParams) => {
  const {
    search = '',
    event_id,
    registration_type,
    is_paid,
    from_date,
    to_date,
  } = queryParams;

  const filters = [];
  let orConditions = [];

  if (typeof search === 'string' && search.trim()) {
    const trimmed = search.trim();
    const dateSearch = new Date(trimmed);

    orConditions = [
      { name: { $regex: trimmed, $options: 'i' } },
      { email: { $regex: trimmed, $options: 'i' } },
      { registration_type: { $regex: trimmed, $options: 'i' } },
    ];

    if (["true", "false", "yes", "no"].includes(trimmed.toLowerCase())) {
      orConditions.push({ is_paid: trimmed.toLowerCase() });
    }

    if (!isNaN(dateSearch)) {
      const startOfDay = new Date(dateSearch.setHours(0, 0, 0, 0));
      const endOfDay = new Date(dateSearch.setHours(23, 59, 59, 999));
      orConditions.push({ registered_at: { $gte: startOfDay, $lte: endOfDay } });
    }
  }

  if (event_id && mongoose.Types.ObjectId.isValid(event_id)) {
    filters.push({ event_id: new mongoose.Types.ObjectId(event_id) });
  }

  if (registration_type) {
    if (Array.isArray(registration_type) && registration_type.length > 0) {
      filters.push({ registration_type: { $in: registration_type } });
    } else if (typeof registration_type === 'string' && registration_type.trim()) {
      filters.push({ registration_type: registration_type.trim() });
    }
  }

  if (is_paid) {
    let paidArray = [];
    if (Array.isArray(is_paid)) {
      paidArray = is_paid
        .map((val) => (typeof val === 'string' ? val.toLowerCase() : String(val).toLowerCase()))
        .filter((v) => ["true", "false", "yes", "no"].includes(v));
    } else if (typeof is_paid === 'string' && is_paid.trim()) {
      const val = is_paid.trim().toLowerCase();
      if (["true", "false", "yes", "no"].includes(val)) {
        paidArray = [val];
      }
    }
    if (paidArray.length > 0) {
      filters.push({ is_paid: { $in: paidArray } });
    }
  }

  if (from_date || to_date) {
    const range = {};
    if (from_date && !isNaN(new Date(from_date))) {
      range.$gte = new Date(from_date);
    }
    if (to_date && !isNaN(new Date(to_date))) {
      range.$lte = new Date(to_date);
    }
    if (Object.keys(range).length > 0) {
      filters.push({ registered_at: range });
    }
  }

  if (orConditions.length > 0 && filters.length > 0) {
    return { $and: [{ $or: orConditions }, ...filters] };
  } else if (orConditions.length > 0) {
    return { $or: orConditions };
  } else if (filters.length > 0) {
    return { $and: filters };
  } else {
    return {};
  }
};
