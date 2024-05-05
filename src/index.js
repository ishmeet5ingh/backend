// require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})


connectDB()
.then(()=> {
    app.listen(process.env.PORT || 8000, ()=> {
        console.log(`Server is running at : ${process.env.PORT}`)
    })

    app.on("error", (error)=> {
        console.log("ERROR: ",error);
        throw err
    })

    // app.on("error", (error) => {...}): This line sets up an event listener on the app object. It listens for the "error" event. Whenever the "error" event is emitted, the provided callback function (error) => {...} will be executed.
})
.catch((err)=> {
    console.log("MONGODB connection failed !!! ", err)
})









/*
import express from "express"
const app = express()

(async () => {
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=> {
            console.log("ERROR: ",error);
            throw err
        })
        app.listen(process.env.PORT, () =>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR: ", error)
        throw err
    }
})()
// DB connected.
*/

// index.js is poluted