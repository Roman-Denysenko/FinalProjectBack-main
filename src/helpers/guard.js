const passport = require('passport')
require('../config/passport-config')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, session) => {
    if (!user || !session || err) {
      return res.status(401).json({
        status: 'failure',
        code: 401,
        message: 'Not authorized',
      })
    }
    req.user = user
    req.session = session
    next()
  })(req, res, next)
}

module.exports = guard
