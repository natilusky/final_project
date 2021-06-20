import asyncHandler from 'express-async-handler'
import connectDB from '../config/db.js'
import bcrypt from 'bcryptjs'

//@desc Auto user & get token
//@route POST /api/users/login
const authUser = asyncHandler(async (req, res) => {
  const user = await connectDB
    .select('user_id', 'username', 'email', 'is_admin', 'password')
    .from('userschema')
    .where({ email: req.body.email })
  const userLogin = { user }.user[0]
  if (userLogin && bcrypt.compareSync(req.body.password, userLogin.password)) {
    userLogin['token'] = null
    res.send(userLogin)
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

//@desc Register a new user
//@route POST /api/users
const registerUser = asyncHandler(async (req, res) => {
  console.log('-> Register attempt: ' + req.body.username)
  await connectDB.select('username')
    .from('userschema')
    .where('username', req.body.username)
    .then((data) => {
      if (data.length == 0) {
        let newuser = {
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          email: req.body.email,
          is_admin: req.body.admin
        }
        connectDB('userschema')
          .returning('*')
          .insert(newuser)
          .then((data) => {
            res.status(201).json({
              user_id: newuser.username,
              email: newuser.email,
              is_admin: newuser.is_admin
            })
          })
      } else {
        res.status(400)
        throw new Error(`${req.body.username} already registered`)
      }
    })
})

export { authUser, registerUser }
