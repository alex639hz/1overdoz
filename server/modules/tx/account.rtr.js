var express = require('express');
var accountCtrl = require('./account.ctrl');
var authCtrl = require('../auth/auth.ctrl');
var userCtrl = require('../user/user.ctrl');
var commCtrl = require('../community/community.ctrl');

const router = express.Router()

// router.param('userId', userCtrl.userByID) //inject object into req.profile
// router.param('community', commCtrl.communityByTitle) //inject title string into req.community
// router.param('accountId', accountCtrl.accountByID) //inject title string into req.community
// const isMember = function (req, res, next) { commCtrl.isMember(req, res, next, req.body.account.community) }


router.route('')
  .post(
    // authCtrl.requireSignin,
    // authCtrl.injectUserProfile,
    // commCtrl.isMember,
    accountCtrl.create
  )

router.route('/tx')
  .post(
    // authCtrl.requireSignin,
    // authCtrl.injectUserProfile,
    // commCtrl.isMember,
    accountCtrl.createTx
  )


router.route('')
  .get(
    // authCtrl.requireSignin,
    // authCtrl.injectUserProfile,
    accountCtrl.read)

// router.route('')
//   .account(
//     authCtrl.requireSignin,
//     authCtrl.injectUserProfile,
//     commCtrl.isMember,
//     accountCtrl.create
//   )

// router.route('/:accountId/approve')
//   .patch(
//     authCtrl.requireSignin,
//     authCtrl.injectUserProfile,
//     authCtrl.isModerator,
//     accountCtrl.approvePost)

module.exports = router;
