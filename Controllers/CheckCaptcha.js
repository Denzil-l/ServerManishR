import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

export const CheckCaptcha = async (CaptchaToken, ip) => {
    console.log(process.env.GOOGLE_CAPTCHA_SERVER)
    if(CaptchaToken !== ''){
        try {
            const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_SERVER}&response=${CaptchaToken}&remoteip=${ip}`)
            const data = response.data
            console.log(data)
            return data
           } catch (error) {
            console.log('Error happened when server tried to verify captcha')
            console.log(error)
           }
           
    }else{
        return {success:true}
    }
 
} 
