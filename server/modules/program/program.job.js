const extend = require("lodash/extend");
const { Program, Step, STEP_MODES } = require("./program.model");
const errorHandler = require("../../helpers/dbErrorHandler");
const { User } = require("../user/user.model");
const CronJob = require("cron").CronJob;

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

module.exports = {
  // getProgramStatus,
  // PROGRAM,
};
