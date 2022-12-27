var express = require('express');
var postCtrl = require('./post.ctrl');
var authCtrl = require('../auth/auth.ctrl');
var userCtrl = require('../user/user.ctrl');
var commCtrl = require('../community/community.ctrl');

const router = express.Router()

router.param('userId', userCtrl.userByID) //inject object into req.profile
router.param('community', commCtrl.communityByTitle) //inject title string into req.community
router.param('postId', postCtrl.postByID) //inject title string into req.community
const isMember = function (req, res, next) { commCtrl.isMember(req, res, next, req.body.post.community) }

router.route('')
  .get(
    authCtrl.requireSignin,
    authCtrl.injectUserProfile,
    postCtrl.listFeed)

router.route('')
  .post(
    authCtrl.requireSignin,
    authCtrl.injectUserProfile,
    commCtrl.isMember,
    postCtrl.create
  )

router.route('/:postId/approve')
  .patch(
    authCtrl.requireSignin,
    authCtrl.injectUserProfile,
    authCtrl.isModerator,
    postCtrl.approvePost)

module.exports = router;
