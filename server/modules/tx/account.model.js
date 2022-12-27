const mongoose = require('mongoose');

/** rawAccountSchema, the signed tx as received from the user  
 * 
 */
const AccountSchema = new mongoose.Schema({

  owner: {
    type: String,
    unique: true,
    index: true,
  },
  senderId: "",
  balance: 0,
  inTxs: [],
  outTxs: [],

}, {
  timestamps: true,
  collection: 'Account',
})


module.exports = {
  Account: mongoose.model('Account', AccountSchema)
}