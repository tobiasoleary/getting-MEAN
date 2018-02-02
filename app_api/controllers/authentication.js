'use strict'

const passport = require('passport')
const mongoose = require('mongoose')
const User = mongoose.model('User')


const sendJSONResponse = (res, status, content) => {
  res.status(status)
  res.json(content)
}

module.exports.register = (req, res) => {
  if(!req.body.name || !req.body.email || !req.body.password) {
    sendJSONResponse(res, 400, {
      'message' : 'All fields required'
    })
    return
  }

  let user = new User()

  user.name = req.body.name
  user.email = req.body.email

  user.setPassword(req.body.password)

  console.log("Saving New User....")
  console.dir(user)
  user.save((err) => {
    console.log("Save Complete")
    let token;

    if(err) {
      sendJSONResponse(res, 404, err)
    } else {
      token = user.generateJwt()
      sendJSONResponse(res, 200, {
        'token' : token
      })
    }
  })
}



module.exports.login = (req, res) => {
  if(!req.body.email || !req.body.password) {
    sendJSONResponse(res, 400, {
      "message" : "All fields required"
    })
    return
  }

  passport.authenticate('local', (err, user, info) => {
    let token;

    if(err) {
      sendJSONResponse(res, 404, err)
      return
    }

    if(user) {
      token = user.generateJwt()
      sendJSONResponse(res, 200, {
        'token' : token
      })
    } else {
      sendJSONResponse(res, 401, info)
    }
  })(req, res)
}
