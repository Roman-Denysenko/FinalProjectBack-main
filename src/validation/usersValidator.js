const Joi = require('joi')

const signinSchema = Joi.object({
  name: Joi.string()
    .pattern(new RegExp('^[A-Z|А-Я][a-z|а-я]*\\s*[A-Z|А-Я]*[a-z|а-я]*$'))
    .required()
    .messages({
      'string.base': `"name" should be a type of 'text'`,
      'string.empty': `"name" cannot be an empty field`,
      'string.pattern.base':
        'First and/or Last names should begin with a capital letter and Field can has one space',
      'any.required': `"name" is a required field`,
    }),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required()
    .messages({
      'string.empty': `"password" cannot be an empty field`,
      'string.pattern.base': `"password" should have a minimum length of 8 symbols,"password" can has a capital letters and/or lowercase letters`,
      'any.required': `"password" is a required field`,
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
}).and('password', 'email')

const loginSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{8,30}$'))
    .required()
    .messages({
      'string.empty': `"password" cannot be an empty field`,
      'string.pattern.base': `"password" should have a minimum length of 8 symbols,"password" can has a capital letters and/or lowercase letters`,
      'any.required': `"password" is a required field`,
    }),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .required(),
}).and('password', 'email')

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: 400,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Not Found',
    })
  }
  next()
}

module.exports.validateSingin = (req, res, next) => {
  return validate(signinSchema, req.body, next)
}
module.exports.validateLogin = (req, res, next) => {
  return validate(loginSchema, req.body, next)
}
