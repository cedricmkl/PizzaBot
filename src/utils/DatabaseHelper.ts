import * as mongoose from "mongoose";

export default class DatabaseHelper {

    static async connect() {
        try {
            console.log("Trying to connect to mongodb")
            await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
            console.log("Connected to mongodb")
        }catch (e) {
            console.error(e)
        }
    }
}