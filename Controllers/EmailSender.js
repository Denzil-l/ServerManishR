import nodemailer from "nodemailer"
import dotenv from 'dotenv'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: `${process.env.EMAIL_ADDRESS}`,
    pass: `${process.env.EMAIL_PASSWORD}`,
  },
});

const SendEmail = async (email,name) => {
    try {
        const info = await transporter.sendMail({
            from: `${process.env.EMAIL_ADDRESS}`, 
            to: email, 
            subject: "ManishR notification",
            text: `Hello, ${name}`, 
            html: `
            <b>Hello, ${name}</b>
            <p>You have been successfully registered with ManishR</p>
            `,
          });
        
          console.log(typeof(info));
          console.log(info);
    } catch (error) {
        console.log(error)
    }
 

}

export default SendEmail