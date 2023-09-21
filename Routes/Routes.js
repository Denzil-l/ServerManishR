import express from 'express'
import { Login,Logout,Register } from '../Controllers/Controllers.js'
import { verifyToken } from '../MiddleWare/VerifyToken.js'
const userRouter = express.Router()

userRouter.post('/register', Register)
userRouter.post('/login', Login)
userRouter.delete('/logout', Logout)
userRouter.post('/verify', verifyToken, (req,res) =>{
    res.status(200).json({status:200})
})

export default userRouter


//This module is used to create routes 