import express from 'express'
import connect from './config/database'
import authRoutes from "./routes/auth.routes"
import chatRoutes from "./routes/chat.routes"
import messageRoutes from "./routes/message.routes"
import cors from "cors"

connect()
const app = express()
app.use(express.json())
app.use(cors(
    {origin:"*"}
))



app.use("/api/v1/auth" , authRoutes)
app.use("/api/v1/chat" , chatRoutes)
app.use("/api/v1/message" , messageRoutes)


app.listen(4000)

export default app

