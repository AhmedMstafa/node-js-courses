const { body } = require('express-validator');

const validationSchema = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('title is required')
      .isLength({ min: 2 })
      .withMessage('title at leaset is 2 digits'),
    body('price')
      .notEmpty()
      .withMessage('price is required')
      .isLength({ min: 2 })
      .withMessage('price at leaset is 2 digits'),
  ];
};

module.exports = {
  validationSchema,
};
