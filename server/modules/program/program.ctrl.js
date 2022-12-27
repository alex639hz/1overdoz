const extend = require("lodash/extend");
const { Program } = require("./program.model");
const programJobs = require("./program.job");
const errorHandler = require("../../helpers/dbErrorHandler");

const create = async (req, res) => {
  const program = new Program(req.body);
  try {
    await program.save();
    return res.status(201).json({
      _id: program._id,
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
    let user = await Program.findById(id).lean();
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
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const list = async (req, res) => {
  try {
    let users = await Program.find().select("email groups");
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

module.exports = {
  create,
  userByID,
  read,
  list,
  remove,
  update,
};
