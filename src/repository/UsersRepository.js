const User = require('../schemas/usersSchema')

class UsersRepository {
  constructor() {
    this.model = User
  }

  async findByEmail(email) {
    const result = await this.model.findOne({ email })
    return result
  }

  async findById(id) {
    const result = await this.model.findOne({ _id: id })
    return result
  }

  async createNewUser(body) {
    const user = new this.model(body)
    user.setPassword(body.password)
    return user.save()
  }

  async updateToken(id, token) {
    const user = await this.model.findByIdAndUpdate(
      id,
      { token },
      { new: true, runValidators: true },
    )
    return user
  }
}

module.exports = UsersRepository
