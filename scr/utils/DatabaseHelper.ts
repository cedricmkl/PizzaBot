import * as mongoose from "mongoose";

export default class DatabaseHelper {

    static connect(){
        mongoose.connect('mongodb://localhost/pizza-bot',{useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
            console.log("Connected to MongoDB")
        })
    }
}