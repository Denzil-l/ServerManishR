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

app.get('/', (req,res) => {
    res.status(200).send('text')
    console.log("Я выполнил запрос")
})

app.listen(process.env.PORT, () => console.log(`Server is working in the PORT: ${process.env.PORT}`))

app.use('/auth', userRouter)


