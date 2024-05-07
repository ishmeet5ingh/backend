import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import 
// files segregation
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter) // write middleware.
// to get the router use middleware
// when someuser write "/users" then control pass to `userRouter`.

// http://localhost:8000/users/register
                      // prefix

export { app }