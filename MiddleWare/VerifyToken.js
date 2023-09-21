import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import { getUserByPhoneNumber } from "../Models/Connections.js";
dotenv.config

export const verifyToken = (req,res, next) => {
    const accessToken = req.body.accessToken
    console.log('I am here in Verify')
    console.log(req.body)
    if(!accessToken) return res.status(401).json({message: 'unathorized'})

    jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET_KEY,(err, decoded) => {
        if(err){
            console.log(err)
            return res.status(403).json({message: 'verify token failed'})
        }
        const phone_number = decoded.phone_number

        const checkUserByPhoneNumber = async () => {
            try {
                const answer = await getUserByPhoneNumber(phone_number)
                if(JSON.stringify(answer).length > 0){
                    return next()
                }
                return res.status(401).json({message: 'unauthorized'})
            } catch (error) {
                return res.status(401).json({message: 'unauthorized'})

            }
        } 

        checkUserByPhoneNumber()
    })
}


//This Middleware verification token. It will used with each user's request after authorization 