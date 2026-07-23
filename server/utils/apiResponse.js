const sendSuccess = (res, statusCode, message, data = null) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });

const sendError = (res, statusCode, message, error = undefined) =>
  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    ...(error ? { error } : {}),
  });

const buildPagination = ({ results, totalCount, page, limit }) => ({
  results,
  totalCount,
  currentPage: page,
  totalPages: Math.ceil(totalCount / limit) || 1,
});

module.exports = { sendSuccess, sendError, buildPagination };
