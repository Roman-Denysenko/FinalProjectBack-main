const { HttpCode } = require('../helpers/constants')
const { DashboardServices } = require('../services')

const dashboardServices = new DashboardServices()

const createCard = async (req, res, next) => {
  const id = req.user._id
  const newCard = Object.assign(req.body, { owner: `${id}` })
  const data = await dashboardServices.createCard(newCard)

  if (newCard) {
    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data,
    })
  }
}

const updateCard = async (req, res, next) => {
  const { id } = req.params

  const data = await dashboardServices.updateCard(id, req.body)

  if (data) {
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data,
    })
  } else {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'failure',
      code: HttpCode.NOT_FOUND,
      message: 'Card not found',
    })
  }
}

const listCards = async (req, res, next) => {
  const userId = req.user.id

  const result = await dashboardServices.getCards(userId)
  res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: result,
  })
}

const updateStatus = async (req, res, next) => {
  const { id } = req.params

  const data = await dashboardServices.updateStatus(id, req.body)

  if (data) {
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data,
    })
  } else {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'failure',
      code: HttpCode.NOT_FOUND,
      message: 'Card not found',
    })
  }
}

const removeCard = async (req, res, next) => {
  const data = await dashboardServices.removeCard(req.params.id)
  if (data) {
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data,
    })
  } else {
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'failure',
      code: HttpCode.NOT_FOUND,
      message: 'Not Found',
    })
  }
}

module.exports = { createCard, updateCard, listCards, updateStatus, removeCard }
