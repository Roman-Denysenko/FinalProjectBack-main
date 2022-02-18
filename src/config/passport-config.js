const passport = require('passport')
const passportJWT = require('passport-jwt')
const Users = require('../schemas/usersSchema')
const Session = require('../schemas/sessionSchema')
require('dotenv').config()

const secret = process.env.SECRET

const ExtractJWT = passportJWT.ExtractJwt
const Strategy = passportJWT.Strategy
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
}

passport.use(
  new Strategy(params, async function (payload, done) {
    try {
      const user = await Users.findOne({ _id: payload.uid })
      if (!user) return done(new Error('User not found'))

      const session = await Session.findOne({ _id: payload.sid })
      if (!session) return done(new Error('Session not found'))

      return done(null, user, session)
    } catch (err) {
      return done(err)
    }
  }),
)
