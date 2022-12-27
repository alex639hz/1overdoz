var express = require('express');
var keywordCtrl = require('./keywords.ctrl');
var authCtrl = require('../auth/auth.ctrl');
var userCtrl = require('../user/user.ctrl');
var commCtrl = require('../community/community.ctrl');

const router = express.Router()

router.route('')
  .post(
    authCtrl.requireSignin,
    keywordCtrl.create)
  .get(
    authCtrl.requireSignin,
    keywordCtrl.list)

module.exports = router;
