const { DashboardRepository } = require('../repository')

class DashboardServices {
  constructor() {
    this.repositories = {
      cards: new DashboardRepository(),
    }
  }

  async createCard(body) {
    const data = await this.repositories.cards.createNewCard(body)
    return data
  }

  async updateCard(id, body) {
    const result = await this.repositories.cards.editCard(id, body)
    return result
  }

  async getCards(userId) {
    const result = await this.repositories.cards.getCards(userId)
    return result
  }

  async updateStatus(id, body) {
    const data = await this.repositories.cards.updateStatus(id, body)
    return data
  }

  async removeCard(id) {
    const results = await this.repositories.cards.removeCard(id)
    return results
  }
}
module.exports = DashboardServices
