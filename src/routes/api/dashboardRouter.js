const express = require('express')
const router = express.Router()

const { asyncWrap } = require('../../helpers/asyncWrap')

const {
  validateUpdateDone,
  validateUpdateCard,
  validateCreateCard,
} = require('../../validation/dashboardValidator')
const guard = require('../../helpers/guard')

const dashboardCtrl = require('../../controllers/dashboardCtrl')

router.post('/', guard, validateCreateCard, asyncWrap(dashboardCtrl.createCard))
router.get('/', guard, asyncWrap(dashboardCtrl.listCards))
router.patch(
  '/:id/done',
  guard,
  validateUpdateDone,
  asyncWrap(dashboardCtrl.updateStatus),
)
router.patch(
  '/:id',
  guard,
  validateUpdateCard,
  asyncWrap(dashboardCtrl.updateCard),
)
router.delete('/:id', guard, asyncWrap(dashboardCtrl.removeCard))

module.exports = router
