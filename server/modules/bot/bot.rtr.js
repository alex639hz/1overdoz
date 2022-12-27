var express = require("express");
var botCtrl = require("./bot.ctrl");
var authCtrl = require("../auth/auth.ctrl");

const router = express.Router();

router.param("userId", botCtrl.userByID);

router.route("");
// .post(botCtrl.create)
// .get(authCtrl.requireSignin, botCtrl.list)

router.route("/").get(authCtrl.requireSignin, botCtrl.read);
// .put(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, botCtrl.update)
// .delete(authCtrl.requireSignin, authCtrl.authorizedToUpdateProfile, botCtrl.remove)

module.exports = router;
