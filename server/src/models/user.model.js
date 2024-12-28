const mongoose = require('mongoose')
const { Schema } = mongoose
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {
  token: { key, expire },
} = require('../configs/env.config.js')

// Define name sub-schema
const nameSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: [2, 'First name should have at least 2 characters'],
  },
  lastName: {
    type: String,
    required: true,
    minlength: [2, 'Last name should have at least 2 characters'],
  },
})

// Define the main user schema
const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Invalid email format',
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    name: nameSchema,
    phone: {
      type: String,
      required: true,
      match: [/^0\d{9}$/, 'Invalid phone number format'], // matches 10-digit Vietnamese phone numbers starting with 0
    },
    avatar: {
      type: String,
      default: 'default.jpg',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

userSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.lastName}`
})
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

// clear data before remove user
// generate accessToken and refreshToken

// method to check token
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

module.exports = mongoose.model('User', userSchema)
