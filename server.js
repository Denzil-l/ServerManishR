import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import userRouter from './Routes/Routes.js'
import { deleteBlockList } from './Models/Connections.js'

dotenv.config()

deleteBlockList()
setInterval(()=>{
    deleteBlockList()
},21600000 )

const app = express()
app.use(cookieParser())

app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use((req, res, next) => {
    const userAgent = req.get('User-Agent');
    console.log(userAgent)
    if (userAgent.includes('MobileAppIdentifier')) {
      // Это мобильное приложение
      req.isMobileApp = true;
    } else {
      // Это браузер
      req.isMobileApp = false;
    }
    next();
  });
  
  app.get('/', (req, res) => {
    if (req.isMobileApp) {
        res.status(200).json({message: 'Это запрос от мобильного приложения.'});
    } else {
        res.status(200).json({message: 'Это запрос от браузера.'});
    }
  });
app.listen(process.env.PORT, () => console.log(`Server is working in the PORT: ${process.env.PORT}`))

app.use('/auth', userRouter)


