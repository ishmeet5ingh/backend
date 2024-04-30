import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected !! DB HOST:  ${connectionInstance.connection.host}`)

    } catch (error) {
        console.log("MONGODB connection error ", error)
        process.exit(1)

        // ye jo current application chal rahi hai, ek process pr chal rahi hogi, ye uska reference hai.
    }
}

export default connectDB