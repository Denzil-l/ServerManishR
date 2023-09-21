import { getUserByPhoneNumber, createUser, checkFormData, checkBlockList, addBlockList, checkEffortsList ,updateEffortsList, deleteEffortsList, addEffortsList } from "../Models/Connections.js";
import SendEmail from "./EmailSender.js";
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { CheckCaptcha } from "./CheckCaptcha.js";


dotenv.config()

export const Register = async (req,res) => {
    //Step 1
    //Server get a request and pull from the req.body all data
    const {name, username, email, phoneNumber, password, honeyPot, captchaToken} = req.body
    console.log(req.body)
            try {
                const answerIP = await checkBlockList(req.ip)
                if(!answerIP){
                    try {
                        //Step 2
                        //Server checks is this user in the table or not
                        console.log('2')
                        if(honeyPot == ''){
                            try {
                                const response = await CheckCaptcha(captchaToken, req.ip)
                                console.log(response)
                                if(response.success){
                                    const userExist = await checkFormData(username, email, phoneNumber)
                                    //If ther user doesn't exist, Server start to creating a new User
                                    console.log('3')
                                    console.log(userExist)
                                    if(!userExist){
                                    try {
                                    //Step 3
                                    //Here Server use bcrypt module for creating hash and adding it to the password for more security 
                                    const saltRounds = 10
                                    const salt = await bcrypt.genSalt(saltRounds)
                                    const hashedPassword = await bcrypt.hash(password, salt)
                                    try {
                                        //Step 4
                                        //Then Server create a new User in the table and response to client status 200
                                        const newUser = await createUser({
                                            name,
                                            username,
                                            email,
                                            phone_number: phoneNumber,
                                            password: hashedPassword,
                                        });                
                                        console.log(newUser)
                                        SendEmail(email, name)
                                        res.status(201).json({message: 'New user was created'})
                                    } catch (error) {
                                        console.log('Error happened on stage of creating a new user ')
                                        console.log(error)
                                        res.status(409).json({message: error})
                                    }
                            } catch (error) {
                                console.log('Error happened on stage of creating a hashedPassword ')
                                console.log(error)
                                res.status(500).json({message: 'Something was wrong when server tried to create a secret password'})
                            }
                            }else{
                                //Step 3
                                //If User already exist, Server response status 400
                                res.status(409).json({message: userExist})   
                            }
                                }else{
                                    try {
                                        console.log('I try to add ip to blocklist 1')
                                        const answer = await addBlockList(req.ip)
                                        console.log(answer)
                                        res.status(201).json({message: 'New user was created'})
                                    } catch (error) {
                                        console.log('Error happened when server tried to add ip to block list')
                                        console.log(error)
                                    }
                                }
                            } catch (error) {
                                console.log('something was wrong when server checked Captcha')
                                console.log(error)
                            }
                            
                        }else{
                            try {
                                console.log('I try to add ip to blocklist 2')
                                const answer = await addBlockList(req.ip)
                                console.log(answer)
                                res.status(201).json({message: 'New user was created'})
                            } catch (error) {
                                console.log('Error happened when server tried to add ip to block list')
                                console.log(error)
                            }
                        }
                      
                
                    } catch (error) {
                        console.log('Error happened on a first stage ')
                        console.log(error)
                        res.status(500).json({message: 'Something was wrong in first stage'})
                    }
                }else{
                    res.status(403).json({message:`you cannot use this service within 24 hours from the moment ${answerIP.added_at}` })
                }
            } catch (error) {
                console.log('Error happened when server try to check Ip address')
                console.log(error)
            }
        }

  

export const Login = async (req,res) => {
    //Step 1
    //Server get a request and pull from the req.body phone_number and password
    const {phone_number, honeyPot, captchaToken} = req.body
    const userAgent = req.headers['user-agent']
    console.log(userAgent)
    console.log(req.body)
    try {
        const answerIP = await checkBlockList(req.ip)
        if(!answerIP){
            try {
                const amountOfEfforts = await checkEffortsList(req.ip)
                if(amountOfEfforts === undefined || amountOfEfforts.efforts < 3){
                    try {
                        console.log('2')
                        if(honeyPot == ''){
                            try {
                                const response = await CheckCaptcha(captchaToken, req.ip)
                                console.log(response)
                                if(response.success){
                                  //-------------------------------------
                                  try {
                                    //Step 2
                                   //Server checks is this user in the table or not
                                   const userExist = await getUserByPhoneNumber(phone_number)
                                   if(userExist !== undefined){
                                 
                                               const userId = userExist.id
                                               const phone_number = userExist.phone_number
                                               const accessToken = jwt.sign({userId, phone_number}, process.env.ACCESS_TOKEN_SECRET_KEY, {expiresIn: '2m'})
                                               // Then Server checks source of the request. If it's a browser, Server send a cookie with this token, if it's a Mobile App, Server make something else
                                               
                                               res.status(200).json({message: 'you loged in', token: accessToken})
                                               try {
                                                    deleteEffortsList(req.ip)
                                               } catch (error) {
                                                
                                               }
                                               console.log('User got token')
                                               console.log(accessToken)
                                       
                                   }else{
                                       //Step 3
                                        try {
                                            if(amountOfEfforts === undefined){
                                                addEffortsList(req.ip)
                                                res.status(400).json({message: 'This user is not exist'})

                                            }else{
                                                updateEffortsList(req.ip)
                                                res.status(400).json({message: 'This user is not exist'})
                                            }
                                        } catch (error) {
                                            console.log('Error happened when server send status 400')
                                            console.log(error)
                                        }

                                       
                                   }
                           
                               } catch (error) {
                                   console.log('Error happened on a first stage ')
                                   console.log(error)
                                   res.status(500).json({message: 'Something was wrong in first stage'})
                               }
        
        
        
                                  //-------------------------------------
                                }else{
                                    try {
                                        console.log('I try to add ip to blocklist 2')
                                        const answer = await addBlockList(req.ip)
                                        console.log(answer)
                                        res.status(200).json({message: 'welcome', token:false})
                                    } catch (error) {
                                        console.log('Error happened when server tried to add ip to block list')
                                        console.log(error)
                                    }
                                }
                            } catch (error) {
                                console.log('something was wrong when server checked Captcha')
                                console.log(error)
                            }
                        }else{
                            try {
                                console.log('I try to add ip to blocklist 2')
                                const answer = await addBlockList(req.ip)
                                console.log(answer)
                                res.status(200).json({message: 'welcome', token:false})
                            } catch (error) {
                                console.log('Error happened when server tried to add ip to block list')
                                console.log(error)
                            }
                        }
                    } catch (error) {
                        console.log('Error happened on a first stage ')
                        console.log(error)
                        res.status(500).json({message: 'Something was wrong in first stage'})
                    } 
                }else{
                    try {
                        console.log('I try to add ip to blocklist 2')
                        const answer1 = await addBlockList(req.ip)
                        console.log(answer1)
                        const answer2 = await deleteEffortsList(req.ip)
                        console.log(answer2)

                        res.status(200).json({message: 'welcome', token:false})
                    } catch (error) {
                        console.log('Error happened when server tried to add ip to block list')
                        console.log(error)
                    }                }
               
            } catch (error) {
                console.log('Error happened when server checked efforts ')
                    console.log(error)
            }
            
        }else{
            res.status(403).json({message:`you cannot use this service within 24 hours from the moment ${answerIP.added_at}` })
        }
    } catch (error) {
        console.log('Error happened when server try to check Ip address')
        console.log(error)
    }




}

export const Logout = async (req,res) => {
    // const userAgent = req.headers['user-agent']
    
    // res.clearCookie('token')
    // return res.status(200).json({message:'You loged out'})
}

//In this module I created 3 function for Register, Login, Logout. They will be used as response for user's request 