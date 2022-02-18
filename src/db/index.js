const mongoose = require('mongoose')

require('dotenv').config()

const uriDb = process.env.DB_HOST

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
})

mongoose.connection.once('open', function () {
  console.log('Database connection successful')
})

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error. Error message: ${err.message}`)
  process.exit(1)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Connection for DB disconnected and app terminated')
    process.exit(1)
  })
})

module.exports = db
