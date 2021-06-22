import asyncHandler from 'express-async-handler'
import connectDB from '../config/db.js'
import bcrypt from 'bcryptjs'
import generateToken from '../utils/generateToken.js'

//@desc Auto user & get token
//@route POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  console.log('Login page');
  const user = await connectDB
    .select('user_id', 'username', 'email', 'is_admin', 'password')
    .from('userschema')
    .where({ email: req.body.email })
  const userLogin = { user }.user[0]
  if (userLogin && bcrypt.compareSync(req.body.password, userLogin.password)) {
    userLogin['token'] = generateToken(userLogin.user_id)
    res.send(userLogin)
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc Get user profile
//@route GET /api/users/profile
const getUserProfile = asyncHandler(async (req, res) => {
  console.log('profile page');
  const user = req.user[0]
  if (user) {
    res.json({
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin,
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc Update user profile
//@route PUT /api/users/profile
const updateUserProfile = asyncHandler(async (req, res) => {
  console.log('update profile page');
  const user = req.user[0]
  if (user) {
    user.username = req.body.username || user.username
    user.email = req.body.email || user.email
      if (req.body.password){
        user.password = req.body.password
      }
      const updateUser = user
      res.json({
        _id: updateUser.user_id,
        username: updateUser.username,
        email: updateUser.email,
        is_admin: updateUser.is_admin,
        token: generateToken(updateUser.user_id)

      })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

//@desc Register a new user
//@route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  console.log('-> Register attempt: ' + req.body.username)
  await connectDB
    .select('username')
    .from('userschema')
    .where('username', req.body.username)
    .then((data) => {
      if (data.length == 0) {
        let newuser = {
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          email: req.body.email,
          is_admin: req.body.admin,
        }
        connectDB('userschema')
          .returning('*')
          .insert(newuser)
          .then((data) => {
            res.status(201).json({
              user_id: newuser.username,
              email: newuser.email,
              is_admin: newuser.is_admin,
            })
          })
      } else {
        res.status(400)
        throw new Error(`${req.body.username} already registered`)
      }
    })
})

export { authUser, registerUser, getUserProfile, updateUserProfile }
