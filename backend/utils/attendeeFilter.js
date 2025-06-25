const mongoose = require('mongoose');

exports.buildFilters = (queryParams) => {
  let {
    search = '',
    event_id,
    registration_type,
    is_paid,
    from_date,
    to_date,
  } = queryParams;

  const filters = [];
  let orConditions = [];

  if (registration_type && !Array.isArray(registration_type)) {
    registration_type = [registration_type];
  }

  if (is_paid && !Array.isArray(is_paid)) {
    is_paid = [is_paid];
  }

  if (typeof search === 'string' && search.trim()) {
    const trimmed = search.trim();
    const dateSearch = new Date(trimmed);

    orConditions = [
      { name: { $regex: trimmed, $options: 'i' } },
      { email: { $regex: trimmed, $options: 'i' } },
      { registration_type: { $regex: trimmed, $options: 'i' } },
    ];

    if (["true", "false", "yes", "no"].includes(trimmed.toLowerCase())) {
      const boolVal = ["true", "yes"].includes(trimmed.toLowerCase());
      orConditions.push({ is_paid: boolVal });
    }

    if (!isNaN(dateSearch.getTime())) {
      const startOfDay = new Date(dateSearch);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(dateSearch);
      endOfDay.setHours(23, 59, 59, 999);
      orConditions.push({ registered_at: { $gte: startOfDay, $lte: endOfDay } });
    }
  }

  if (event_id && mongoose.Types.ObjectId.isValid(event_id)) {
    filters.push({ event_id: new mongoose.Types.ObjectId(event_id) });
  }

  if (registration_type && registration_type.length > 0) {
    const cleaned = registration_type.map((v) => v.trim()).filter(Boolean);
    if (cleaned.length > 0) {
      filters.push({ registration_type: { $in: cleaned } });
    }
  }

  if (is_paid && is_paid.length > 0) {
    const paidValues = is_paid
      .map((val) => String(val).toLowerCase())
      .filter((v) => ["true", "false", "yes", "no"].includes(v))
      .flatMap((v) => {
        if (["true", "yes"].includes(v)) {
          return [true, "Yes"];
        } else if (["false", "no"].includes(v)) {
          return [false, "No"];
        }
        return [];
      });

    if (paidValues.length > 0) {
      filters.push({ is_paid: { $in: paidValues } });
    }
  }

  if (from_date || to_date) {
    const range = {};
    const currentYear = new Date().getFullYear();

    if (from_date) {
      let fromDate = new Date(from_date);
      if (isNaN(fromDate.getTime()) && from_date.match(/^[A-Za-z]+$/)) {
        fromDate = new Date(`${from_date} 1, ${currentYear}`);
      }
      if (!isNaN(fromDate.getTime())) {
        fromDate.setHours(0, 0, 0, 0);
        range.$gte = fromDate;
      }
    }

    if (to_date) {
      let toDate = new Date(to_date);
      if (isNaN(toDate.getTime()) && to_date.match(/^[A-Za-z]+$/)) {
        toDate = new Date(`${to_date} 1, ${currentYear}`);
        toDate.setMonth(toDate.getMonth() + 1, 0);
        toDate.setHours(23, 59, 59, 999);
      } else if (!isNaN(toDate.getTime())) {
        toDate.setHours(23, 59, 59, 999);
      }
      if (!isNaN(toDate.getTime())) {
        range.$lte = toDate;
      }
    }

    if (Object.keys(range).length > 0) {
      filters.push({ registered_at: range });
    }
  }

  const finalQuery =
    orConditions.length > 0 && filters.length > 0
      ? { $and: [{ $or: orConditions }, ...filters] }
      : orConditions.length > 0
      ? { $or: orConditions }
      : filters.length > 0
      ? { $and: filters }
      : {};

  console.log("🛠 Final Mongo Query:", JSON.stringify(finalQuery, null, 2));
  return finalQuery;
};