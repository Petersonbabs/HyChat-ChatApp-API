import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

// ROUTERS
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'


import errorHandler from './middleware/errorHandler.js'

dotenv.config()
const app = express()
app.use(express.json());
app.use(morgan("dev"))
app.use(cors());


// IMPORTED ENDPOINTS
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/users', userRoutes)

// BASE ENDPOINT
app.get("/api/v1", (req, res) => { res.send("welcome to HyChat api version 1") })


app.all("*", (req, res) => {
    res.json(`${req.method} ${req.originalUrl} is not an endpoint on this server`)
})

app.use("*", errorHandler)

export default app