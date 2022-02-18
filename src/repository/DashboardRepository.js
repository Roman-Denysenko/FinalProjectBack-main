const Card = require('../schemas/dashboardSchema')

class DashboardRepository {
  constructor() {
    this.model = Card
  }

  get date() {
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    return day
  }

  get today() {
    return this.date.toISOString()
  }

  get tomorrow() {
    const tomorrow = this.date
    tomorrow.setDate(this.date.getDate() + 1)
    return tomorrow.toISOString()
  }

  get nextDay() {
    const next = this.date
    next.setDate(this.date.getDate() + 2)
    return next.toISOString()
  }

  async createNewCard(body) {
    const card = new this.model(body)
    return card.save()
  }

  async editCard(id, body) {
    const result = await this.model.findByIdAndUpdate(id, body, { new: true })
    return result
  }

  async removeCard(id) {
    const result = await this.model.findByIdAndRemove(id)
    return result
  }

  async getTodayCards(userId) {
    console.dir(this.tomorrow)
    return await this.model
      .find({
        owner: userId,
        date: { $lte: this.tomorrow },
        done: false,
      })
      .sort({ date: 1 })
  }

  async getTomorrowCards(userId) {
    return await this.model
      .find({
        owner: userId,
        date: { $gte: this.tomorrow, $lte: this.nextDay },
        done: false,
      })
      .sort({ date: 1 })
  }

  async getRestCards(userId) {
    return await this.model
      .find({
        owner: userId,
        date: { $gte: this.nextDay },
        done: false,
      })
      .sort({ date: 1 })
  }

  async getDoneCards(userId) {
    return await this.model.find({
      owner: userId,
      done: true,
    })
  }

  async getCards(userId) {
    const today = await this.getTodayCards(userId)

    const tomorrow = await this.getTomorrowCards(userId)

    const rest = await this.getRestCards(userId)

    const done = await this.getDoneCards(userId)

    return { today, tomorrow, rest, done }
  }

  async updateStatus(id, body) {
    const data = await this.model.findByIdAndUpdate(id, body, { new: true })
    return data
  }
}
module.exports = DashboardRepository
