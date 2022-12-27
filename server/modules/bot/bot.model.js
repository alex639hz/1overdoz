const mongoose = require("mongoose");
const crypto = require("crypto");
const config = require("../../config/config");

const CtxSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      index: true,
      unique: true,
    },

    ctx: {
      // id: Number,
      // first_name: String,
      // last_name: String,
      // type: String,
    },
  },
  { timestamps: true }
);

const BotMsgSchema = new mongoose.Schema(
  {
    text: {
      // id: Number,
      // first_name: String,
      // last_name: String,
      // type: String,
    },
    from: {
      // id: Number,
      // is_bot: Boolean,
      // first_name: String,
      // last_name: String,
      // language_code: String,
    },
    botInfo: {},
    message_id: Number,
    text: String,
    date: Number,
  },
  { timestamps: true }
);

module.exports = {
  Bot: mongoose.model("Bot", BotMsgSchema),
  Ctx: mongoose.model("Ctx", CtxSchema),
};
