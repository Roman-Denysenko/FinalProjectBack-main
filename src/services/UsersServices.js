const { UsersRepository } = require('../repository')

class UsersServices {
  constructor() {
    this.repositories = {
      users: new UsersRepository(),
    }
  }

  async create(body) {
    const data = await this.repositories.users.createNewUser(body)
    return data
  }

  async findByEmail(email) {
    const data = await this.repositories.users.findByEmail(email)
    return data
  }

  async findById(id) {
    const data = await this.repositories.users.findById(id)
    return data
  }
}
module.exports = UsersServices
