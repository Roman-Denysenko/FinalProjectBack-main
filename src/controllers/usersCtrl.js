const { UsersServices, AuthServices } = require('../services/index')
const Session = require('../schemas/sessionSchema')
const { HttpCode } = require('../helpers/constants')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const secret = process.env.SECRET

const usersServices = new UsersServices()
const authServices = new AuthServices()

const signin = async (req, res, next) => {
  const { email, password, name } = req.body
  const double = await usersServices.findByEmail(email)
  if (double) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'failure',
      code: HttpCode.CONFLICT,
      message: 'This email is already in use',
    })
  }
  const newUser = await usersServices.create({
    email,
    password,
    name,
  })

  const isSucces = await authServices.signin(newUser)

  if (!isSucces) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'failure',
      code: HttpCode.UNAUTHORIZED,
      message: 'User Unauthorized',
    })
  }

  if (isSucces.message) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'failure',
      code: HttpCode.BAD_REQUEST,
      message: isSucces.message,
    })
  }

  const { tokenAccess, tokenRefresh, sid, user } = isSucces

  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    tokenAccess,
    tokenRefresh,
    sid,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  const isSucces = await authServices.login({ email, password })

  if (!isSucces) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'failure',
      code: HttpCode.UNAUTHORIZED,
      message: 'User Unauthorized',
    })
  }

  if (isSucces.message) {
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'failure',
      code: HttpCode.BAD_REQUEST,
      message: isSucces.message,
    })
  }

  const { tokenAccess, tokenRefresh, sid, user } = isSucces

  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    tokenAccess,
    tokenRefresh,
    sid,
    user: {
      token: user.token,
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}

const refreshToken = async (req, res, next) => {
  const header = req.get('Authorization')

  const refreshToken = header.replace('Bearer ', '')

  const payload = await authServices.verifyToken(refreshToken)

  if (!payload) {
    await Session.findByIdAndRemove(payload.uid)
    return res.status(HttpCode.UNAUTHORIZED).json({ message: 'Unauthorized' })
  }
  const user = await usersServices.findById(payload.uid)

  if (!user) {
    await Session.findByIdAndRemove(payload.uid)
    return res.status(HttpCode.NOT_FOUND).json({ message: 'User not found' })
  }

  await Session.findByIdAndRemove(payload.uid)
  const newSession = await Session.create({ uid: payload.uid })
  const newPayload = { sid: newSession._id, uid: payload.uid }
  const tokenRefresh = jwt.sign(newPayload, secret, { expiresIn: '1h' })
  const tokenAccess = jwt.sign(newPayload, secret, { expiresIn: '168h' })

  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    tokenAccess,
    tokenRefresh,
    sid: newSession._id,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
  })
}

const logout = async (req, res, next) => {
  await Session.deleteOne({ _id: req.session._id })

  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: 'Successfully logged out',
  })
}

module.exports = { signin, login, logout, refreshToken }
