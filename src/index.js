import dotenv from "dotenv"
import { connectDB } from "./db/index.js"
import { app } from "./app.js"

dotenv.config({
    path: './.env'
})

connectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`server is listening on port ${process.env.PORT}`)
    })

    app.on("error", (error)=> {
        console.log(`Error: ${error}`)
        throw err
    })
})
.catch((error)=> {
    console.log(`mongodb connection failed!!! `, error)
})