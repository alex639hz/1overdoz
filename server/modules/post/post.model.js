const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({

  title: {
    type: String,
    unique: 'Title must be unique',
    trim: true,
    maxLength: 60,
    required: 'Title is required'

  },

  community: {
    type: String,
    trim: true,
    maxLength: 60,
    required: 'community name is required'
  },

  summary: {
    type: String,
    trim: true,
    maxLength: 150,
  },

  body: {
    type: String,
    trim: true,
    maxLength: 1500,
    required: 'Body is required'
  },

  author: { type: mongoose.Schema.ObjectId, ref: 'User' },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],

  photo: {
    data: Buffer,
    contentType: String
  },

  status: {
    type: String,
    enum: [
      'pending',
      'approved',
    ],
    default: 'pending'
  },

  country: {
    type: String,
    default: 'None'
  },

  score: {
    type: Number,
    default: 0
  },


}, { timestamps: true })

module.exports = {
  Post: mongoose.model('Post', PostSchema)
}