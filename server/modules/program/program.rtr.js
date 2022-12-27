var express = require("express");
var programCtrl = require("./program.ctrl");
var authCtrl = require("../auth/auth.ctrl");

const router = express.Router();

router.param("userId", programCtrl.userByID);

router
  .route("")
  .post(programCtrl.create)
  .get(authCtrl.requireSignin, programCtrl.list);

router
  .route("/:userId")
  .get(authCtrl.requireSignin, programCtrl.read)
  .put(
    authCtrl.requireSignin,
    authCtrl.authorizedToUpdateProfile,
    programCtrl.update
  )
  .delete(
    authCtrl.requireSignin,
    authCtrl.authorizedToUpdateProfile,
    programCtrl.remove
  );

module.exports = router;
