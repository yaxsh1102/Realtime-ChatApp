import express from 'express'
import connect from './config/database'
import authRoutes from "./routes/auth.routes"
connect()
const app = express()
app.use(express.json())

app.use("/api/v1/auth" , authRoutes)
app.listen(4000)

