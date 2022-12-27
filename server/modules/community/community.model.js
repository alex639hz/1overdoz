const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({

  title: {
    type: String,
    index: true,
    trim: true,
    unique: 'Title already exists',
    maxlength: 60,
    required: 'Community title is required'
  },

  members: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  pendingMembers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],


}, { timestamps: true })

module.exports = {
  Community: mongoose.model('Community', CommunitySchema)
}