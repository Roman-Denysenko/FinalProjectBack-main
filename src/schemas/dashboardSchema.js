const mongoose = require('mongoose')
const { Schema, SchemaTypes } = mongoose

const cardSchema = new Schema({
  task: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    default: 'normal',
  },
  date: {
    type: Date,
    required: true,
  },
  chalenge: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    default: 'stuff',
  },
  done: {
    type: Boolean,
    default: false,
  },
  owner: {
    type: SchemaTypes.ObjectId,
    ref: 'user',
    required: true,
  },
})

const Card = mongoose.connection.model('Card', cardSchema, 'card')
module.exports = Card
