const { HttpCode } = require('./constants')

const asyncWrap =
  cb =>
  async (...args) => {
    try {
      const result = await cb(...args)
      return result
    } catch ({ message }) {
      res.status(HttpCode.BAD_REQUEST).json({
        status: 'failure',
        code: HttpCode.BAD_REQUEST,
        message,
      })
      console.log(`OTHER error: ${message}`)
    }
  }

module.exports = { asyncWrap }
