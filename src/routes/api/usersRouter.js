const express = require('express')
const router = express.Router()
const guard = require('../../helpers/guard')
const {
  validateSingin,
  validateLogin,
} = require('../../validation/usersValidator')

const { asyncWrap } = require('../../helpers/asyncWrap')

const usersCtrl = require('../../controllers/usersCtrl')

router.post('/signin', validateSingin, asyncWrap(usersCtrl.signin))

router.post('/login', validateLogin, asyncWrap(usersCtrl.login))

router.post('/logout', guard, asyncWrap(usersCtrl.logout))

router.post('/refresh', guard, asyncWrap(usersCtrl.refreshToken))

module.exports = router
