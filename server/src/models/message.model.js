const mongoose = require('mongoose')

const { Schema } = mongoose

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: String,
    read: { type: Boolean, default: false },
    image: { type: String, default: false },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('Message', messageSchema)
