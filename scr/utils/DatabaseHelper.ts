import * as mongoose from "mongoose";

export default class DatabaseHelper {

    static connect(){
        mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log("Connected to MongoDB")
        })
    }
}