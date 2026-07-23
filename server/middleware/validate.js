const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => error.msg)
      .join(', ');

    return res.status(400).json({
      success: false,
      message,
      data: null,
    });
  }

  return next();
};

module.exports = validate;
