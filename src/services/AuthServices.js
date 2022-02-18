const { UsersRepository } = require('../repository')
const Session = require('../schemas/sessionSchema')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const secret = process.env.SECRET

class AuthServices {
  constructor() {
    this.model = Session
    this.repositories = {
      users: new UsersRepository(),
    }
  }

  async signin(user) {
    const idUser = user._id
    const newUserSession = new this.model({ uid: idUser })
    newUserSession.save()
    const sessionPayload = { uid: idUser, sid: newUserSession._id }

    const tokenAccess = jwt.sign(sessionPayload, secret, { expiresIn: '1h' })
    const tokenRefresh = jwt.sign(sessionPayload, secret, { expiresIn: '168h' })
    return {
      tokenAccess,
      tokenRefresh,
      sid: newUserSession._id,
      user,
    }
  }

  async login({ email, password }) {
    const user = await this.repositories.users.findByEmail(email)
    if (!user) return null
    const valid = await user.validPassword(password)
    if (!valid) return { message: 'Invalid password' }
    const idUser = user._id
    const newUserSession = new this.model({ uid: idUser })
    newUserSession.save()
    const sessionPayload = { uid: idUser, sid: newUserSession._id }
    const tokenAccess = jwt.sign(sessionPayload, secret, { expiresIn: '1h' })
    const tokenRefresh = jwt.sign(sessionPayload, secret, { expiresIn: '168h' })

    return {
      tokenAccess,
      tokenRefresh,
      sid: newUserSession._id,
      user,
    }
  }

  async logout(id) {
    const userWithoutToken = await this.repositories.users.updateToken(id, null)
    return {
      user: userWithoutToken,
    }
  }

  async verifyToken(token) {
    const payload = await jwt.verify(token, secret)
    return payload
  }
}

module.exports = AuthServices
