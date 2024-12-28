const { body } = require('express-validator')

const createUserValidator = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .notEmpty()
    .withMessage('Password is required'),
  body('name.firstname')
    .isLength({ min: 2 })
    .withMessage('First name must have at least 2 characters')
    .notEmpty()
    .withMessage('First name is required'),
  body('name.lastname')
    .isLength({ min: 2 })
    .withMessage('Last name must have at least 2 characters')
    .notEmpty()
    .withMessage('Last name is required'),
  body('phone')
    .matches(/^\d{1}-\d{3}-\d{3}-\d{4}$/)
    .withMessage('Phone number must be in format 1-XXX-XXX-XXXX')
    .notEmpty()
    .withMessage('Phone number is required'),
]

const updateUserValidator = [
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name.firstname')
    .optional()
    .isLength({ min: 2 })
    .withMessage('First name must have at least 2 characters'),
  body('name.lastname')
    .optional()
    .isLength({ min: 2 })
    .withMessage('Last name must have at least 2 characters'),
  body('phone')
    .optional()
    .matches(/^\d{1}-\d{3}-\d{3}-\d{4}$/)
    .withMessage('Phone number must be in format 1-XXX-XXX-XXXX'),
  body('address.city')
    .optional()
    .notEmpty()
    .withMessage('City cannot be empty if provided'),
  body('address.street')
    .optional()
    .notEmpty()
    .withMessage('Street cannot be empty if provided'),
  body('address.number')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Street number must be greater than zero'),
  body('address.zipcode')
    .optional()
    .matches(/^\d{5}-\d{4}$/)
    .withMessage('Zipcode must be in format XXXXX-XXXX'),
]

module.exports = { createUserValidator, updateUserValidator }
