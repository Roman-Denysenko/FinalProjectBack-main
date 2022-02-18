const Joi = require('joi')
const { HttpCode } = require('../helpers/constants')

const doneUpdateSchema = Joi.object({
  done: Joi.boolean().required(),
})

const schemaCreateCard = Joi.object({
  task: Joi.string().min(2).max(100).allow('').required(),
  level: Joi.any().valid('easy', 'normal', 'hard').optional(),
  date: Joi.date().greater('now').required(),
  chalenge: Joi.boolean().optional(),
  category: Joi.any()
    .valid('stuff', 'family', 'health', 'learning', 'leisure', 'work')
    .optional(),
  done: Joi.boolean().optional(),
  owner: Joi.string(),
})

const schemaUpdateCard = Joi.object({
  task: Joi.string().min(2).max(100).allow('').required(),
  level: Joi.any().valid('easy', 'normal', 'hard').optional(),
  date: Joi.date().greater('now').required(),
  chalenge: Joi.boolean().optional(),
  category: Joi.any()
    .valid('stuff', 'family', 'health', 'learning', 'leisure', 'work')
    .optional(),
  done: Joi.boolean().optional(),
  owner: Joi.string(),
})

const validate = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HttpCode.BAD_REQUEST,
      message: `Field: ${message.replace(/"/g, '')}`,
      data: 'Not Found',
    })
  }
  next()
}

module.exports.validateUpdateDone = (req, res, next) => {
  return validate(doneUpdateSchema, req.body, next)
}
module.exports.validateUpdateCard = (req, res, next) => {
  return validate(schemaUpdateCard, req.body, next)
}

module.exports.validateCreateCard = (req, res, next) => {
  return validate(schemaCreateCard, req.body, next)
}
