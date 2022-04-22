const mongoose = require("mongoose")

//connect to the mongo database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)

        console.log(`MongoDB Connected : ${conn.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB