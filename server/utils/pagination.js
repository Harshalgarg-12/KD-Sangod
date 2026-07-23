const parsePagination = (query) => {
  const page = Math.max(parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 100);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const parseSort = (sortBy, allowedFields, defaultSort = '-createdAt') => {
  if (!sortBy) {
    return defaultSort;
  }

  const descending = sortBy.startsWith('-');
  const field = descending ? sortBy.slice(1) : sortBy;

  if (!allowedFields.includes(field)) {
    return defaultSort;
  }

  return descending ? `-${field}` : field;
};

module.exports = { parsePagination, parseSort };
