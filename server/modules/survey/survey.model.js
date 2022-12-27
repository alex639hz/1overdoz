const mongoose = require('mongoose');
const crypto = require('crypto');
const config = require('../../config/config');


const AnswerSchema = new mongoose.Schema({

  questionId: { type: mongoose.Schema.ObjectId, ref: 'Question' },

  answer: {
    type: "", // type of the answer i.e. text, number, single-options, multi-option, email etc.
    content: {}
  },

}, { timestamps: true })



const QuestionSchema = new mongoose.Schema({

  type: { type: "" }, // type of the question i.e. text, images
  content: { type: {} },
  possibleAnswers: [{ type: "", content: {} }],

}, { timestamps: true })


const SurveySchema = new mongoose.Schema({

  questions: [QuestionSchema],

  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },

  hashed_password: {
    type: String,
    required: 'Password is required!'
  },

  salt: String,

  name: {
    type: String,
    trim: true,
    match: [/a-zA-Z /, 'Please fill a valid email address'],
  },

  role: {
    type: String,
    enum: [
      '',
      'super',
      'moderator',
    ],
    default: ''
  },

  country: {
    type: String,
    enum: [
      '',
      'US',
      'IL',
    ],
    default: 'IL'
  },

  communities: {
    type: [String]
  },

  image: {
    type: String,
    trim: true,
    maxlength: 255,
    default: 'www.example.com',
  },

}, { timestamps: true })

SurveySchema
  .virtual('password')
  .set(function (password) {
    this._password = password
    this.salt = this.makeSalt()
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function () {
    return this._password
  })


SurveySchema.path('hashed_password').validate(function (v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

SurveySchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function (password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  },

}

module.exports = {
  Survey: mongoose.model('Survey', SurveySchema)
}