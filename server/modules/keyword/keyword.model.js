const mongoose = require('mongoose');

const KeywordSchema = new mongoose.Schema({

  keyword: {
    type: String,
    index: true,
    unique: 'Keyword must be unique',
    trim: true,
    maxLength: 60,
    required: 'Keyword is required'
  },

}, { timestamps: true })

module.exports = {
  Keyword: mongoose.model('Keyword', KeywordSchema)
}