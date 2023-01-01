const extend = require("lodash/extend");
const { Bot, Ctx } = require("./bot.model");
const { PROGRAM } = require("../program/program.lib");
const { User, USER_GENDER } = require("../user/user.model");
const { getProgramStatus } = require("../program/program.lib");
const errorHandler = require("../../helpers/dbErrorHandler");

const create = async (req, res) => {
  const bot = new Bot(req.body);
  try {
    await bot.save();
    return res.status(201).json({
      _id: bot._id,
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/** inject user document into req.community
 *
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await Bot.findById(id).lean();
    if (!user)
      return res.status("400").json({
        error: "User not found",
      });
    req.profile = { ...user };
    next();
    return { ...req.profile };
  } catch (err) {
    return res.status("400").json({
      error: "Could not retrieve user",
    });
  }
};

const read = (req, res) => {
  // req.profile.hashed_password = undefined
  // req.profile.salt = undefined
  // return res.json(req.profile)
  return res.json({ status: "ok" });
};

const list = async (req, res) => {
  try {
    let users = await Bot.find().select("email groups");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const update = async (req, res) => {
  try {
    let user = req.profile;
    user = extend(user, req.body);
    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

//=================== cron jobs ======================

var CronJob = require("cron").CronJob;

//=================== telegram bot ======================

function bot1() {
  const { Telegraf } = require("telegraf");
  const { message } = require("telegraf/filters");
  const { MenuTemplate, MenuMiddleware } = require("telegraf-inline-menu");

  function _getGenderMenu() {
    const menuTemplate = new MenuTemplate(_onMenuCall);

    menuTemplate.interact("Female", USER_GENDER.FEMALE, {
      do: async (ctx) => await _onGenderSelection(ctx),
    });

    menuTemplate.interact("Male", USER_GENDER.MALE, {
      do: async (ctx) => await _onGenderSelection(ctx),
    });

    return menuTemplate;

    async function _onMenuCall(ctx) {
      await Ctx.create({ ctx });
      return `Hey ${ctx.from.first_name}! Please Select your gender`;
    }

    async function _onGenderSelection(ctx) {
      const status = await _updateUserGender(ctx);
      await ctx.reply(status);

      // You have to return in your do function if
      // you want to update the menu afterwards or not.
      // If not just use return false.
      return false;

      async function _updateUserGender(ctx) {
        const thisCtx = { ...ctx };
        const gender = `${thisCtx.match.input}`.replace("/", "");
        const botId = thisCtx.update.callback_query.from.id;
        const user = await User.findOneAndUpdate({ botId }, { gender });
        if (!user) return "could not update gender";
        return "gender updated";
      }
    }
  }

  async function _botMiddleware(ctx, next) {
    const thisCtx = { ...ctx };
    await Ctx.findOneAndUpdate(
      { chatId: ctx.update.message.chat.id, ctx },
      { ctx },
      { upsert: true }
    );
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log("_botMiddleware Response time: %sms", ms);
  }

  const menuTemplate = _getGenderMenu();
  const menuMiddleware = new MenuMiddleware("/", menuTemplate);

  
  const bot = new Telegraf(process.env.BOT_API);
  bot.command("/begin", _onBegin);
  bot.command("/newuser", _createUserFromMessage);
  bot.command("/gender", (ctx) => menuMiddleware.replyToContext(ctx));
  // bot.use(_botMiddleware);
  bot.use(menuMiddleware);
  bot.start((ctx) => ctx.reply("Welcome"));
  bot.help((ctx) => ctx.reply("Send me a sticker"));
  bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
  bot.on(message("sticker"), (ctx) => ctx.reply("👍"));
  bot.hears("hi", (ctx) => ctx.reply("Hey there"));
  bot.on(message("text"), async (ctx) => {
    // const result = await _parseMsg(ctx.message);
    //  const popUser = await _getPopulatedUserByBotIdOrReply(ctx.message);
    // await ctx.reply(_getStatus(popUser, ctx));
    await ctx.reply("TBD...");
  });
  bot.launch();

  // Enable graceful stop
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  async function _parseMsg(msg) {
    const chatId = msg.chat.id;
    let msgRes = ` Echo: ${msg.text}`;
    switch (msg.text) {
      case "/?": {
        console.log(`echo: ${msgRes}`);
        const botMsg = new Bot(msg);
        const step = getProgramStatus(0);
        await botMsg.save();

        // msg.from.id
        const user = await User.findOne({ botId: msg.from.id }).populate(
          "programId"
        );

        if (!user) bot.sendMessage(chatId, "user not found");
        else
          bot.sendMessage(
            chatId,
            `
      ${user.email}
      ${step.payload}
      ...`
          );
      }
      default: {
        /**
         * get user by botId
         * get program by user.programId
         * get current step
         * if msg == stepIdx then ++stepIdx and replay ok
         * replay error message
         */

        console.log(`echo: ${msgRes}`);
        const botMsg = new Bot(msg);
        const step = getProgramStatus(0);
        await botMsg.save();

        const user = await _getPopulatedUserByBotIdOrReply(msg);
        const result = await _processMsg(user, msg);
        bot.sendMessage(chatId, result);
      }
    }
    return false;
  }

  async function _onBegin(ctx) {
    const job = new CronJob(
      "*/1 * * * *",
      async function () {
        const users = await User.find().populate("programId").lean();
        const that = this;
        // await ctx.reply(new Date().toISOString());
      },
      null,
      true,
      "America/Los_Angeles"
    );

    const botId = `${ctx?.from?.id}`;
    let status = "user created";
    await User.create({
      botId,
      ctx,
    }).catch((err) => {
      status = "user could not be created ";
    });
    ctx.reply(status);
  }

  async function _createUserFromMessage(ctx) {
    const botId = `${ctx?.from?.id}`;
    let status = "user created";
    await User.create({
      botId,
      ctx,
    }).catch((err) => {
      status = "user could not be created ";
    });
    ctx.reply(status);
  }
}

//=================== telegram bot ======================
function bot2() {
  const TelegramBot = require("node-telegram-bot-api");
  const { Program } = require("../program/program.model");

  // replace the value below with the Telegram token you receive from @BotFather
  const token = "5962551933:AAH4mIVAHqB635oy37p0QrNUKJAawhh5yTc";

  // Create a bot that uses 'polling' to fetch new updates
  const bot = new TelegramBot(token, { polling: true });

  // Matches "/echo [whatever]"
  bot.onText(/\/echo (.+)/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message

    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
    // send back the matched "whatever" to the chat
    bot.sendMessage(chatId, resp);
  });

  // Listen for any kind of message. There are different kinds of
  // messages.
  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    let msgRes = ` Echo: ${msg.text}`;
    switch (msg.text) {
      case "/help": {
        msgRes =
          "this is a help section:" +
          `
      /clear delete bot messages from db
      /add add something to db
      /other add other something to db
      `;
        bot.sendMessage(chatId, msgRes);
        break;
      }
      case "/clear": {
        console.log(`Bot deleteMany...`);
        Bot.deleteMany().exec();
        msgRes = "cleared successfully";
        bot.sendMessage(chatId, msgRes);
        break;
      }
      case "/linkuser": {
        console.log(`link user...`);
        const user = await User.findOneAndUpdate(
          { botId: undefined },
          { botId: msg.from.id }
        );
        bot.sendMessage(chatId, "user linked");
        break;
      }
      case "/createuser": {
        console.log(`link user...`);
        const program = new Program({
          userId: "",
          content: [],
        });
        await program.save();

        const user = await User.create({
          botId: msg.from.id,
          programId: program._id,
        });

        bot.sendMessage(
          chatId,
          `
      new user created
user._id: ${user._id}
program._id: ${program._id}
      ${user._id}
      `
        );
        break;
      }
      case "/newprogram": {
        // console.log(`new program: ${msgRes}`);
        const program = new Program({
          userId: "",
          content: [],
        });
        await program.save();
        await User.findOneAndUpdate(
          { botId: msg.from.id },
          { programId: program._id }
        );
        break;
      }
      case "/?": {
        console.log(`echo: ${msgRes}`);
        const botMsg = new Bot(msg);
        const step = getProgramStatus(0);
        await botMsg.save();

        // msg.from.id
        const user = await User.findOne({ botId: msg.from.id }).populate(
          "programId"
        );

        if (!user) bot.sendMessage(chatId, "user not found");
        else
          bot.sendMessage(
            chatId,
            `
      ${user.email}
      ${step.payload}
      ...`
          );
      }
      default: {
        /**
         * get user by botId
         * get program by user.programId
         * get current step
         * if msg == stepIdx then ++stepIdx and replay ok
         * replay error message
         */

        console.log(`echo: ${msgRes}`);
        const botMsg = new Bot(msg);
        const step = getProgramStatus(0);
        await botMsg.save();

        const user = await _getPopulatedUserByBotIdOrReply(msg);
        const result = await _processMsg(user, msg);
        bot.sendMessage(chatId, result);
      }
    }
    return false;
  });
}

async function _isValidUser(msg) {
  return User.create({
    botId: msg?.from?.id,
  });
}

function _getStatus(user, ctx) {
  return `
hi: ${user.email} 
stepIdx: ${user.programId.stepIdx} 
echo: ${ctx.message.text}`;
}

/** fetch user by bot id or reply error message to user  */
async function _getPopulatedUserByBotIdOrReply(msg) {
  const user = await User.findOne({ botId: msg.from.id }).populate("programId");
  if (!user) return bot.sendMessage(chatId, "user not found");
  return user;
}
async function _processMsg(populatedUser, msg) {
  const reqIdx = +`${msg.text}`.trim();

  const program = PROGRAM[reqIdx];
  return `
reqIdx: ${reqIdx}
title: ${program?.title}  
${populatedUser.email}
        ...`;
}

bot1();

module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update,
};
