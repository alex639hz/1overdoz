const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../../config/config');
const { User } = require('../user/user.model');
const userCtrl = require('../user/user.ctrl');

const signin = async (req, res) => {

  try {
    let user = await User.findOne({
      "email": req.body.email
    })

    if (!user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }
    /**
     * 'payload' injected into Bearer header 
     *  cookie is injected into req.auth by requireSignin middleware
     */
    const payload = {
      _id: user._id,
    }
    const token = jwt.sign(payload, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.status('200').json({
      token,
      _id: user._id,
      country: user.country,
    })
  } catch (err) {
    return res.status('401').json({
      error: "Could not sign in because " + err.message
    })
  }
}

const signout = (req, res) => {
  const cookie = req.headers.cookie || 'No Cookie Was Found'

  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out",
    cookie
  })
}

/**
 * compare Bearer Token to jwt-secret 
 * and inject the payload object into req.auth  
 */
const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

const authorizedToUpdateProfile = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

const authorizedToPost = async (req, res, next) => {
  let authorized = 1
  commCtrl.isMember()
  if (!(authorized)) {
    return res.status('403').json({
      error: "User not authorized to post: must be a community member."

    })
  }
  next()
}

const isModerator = async (req, res, next) => {
  switch (req.profile.role) {
    case 'moderator':
    case 'super':
      next()
      break;
    default:
      return res.status('403').json({
        error: "User is not a moderator"
      })
  }
}

/** inject user document into req.profile
 * 
 */
const injectUserProfile = async function (req, res, next) {
  const result = await userCtrl.userByID(req, res, next, req.auth._id)
}


module.exports = {
  signin,
  signout,
  requireSignin,
  authorizedToUpdateProfile,
  authorizedToPost,
  isModerator,
  injectUserProfile,
}
