import {Schema, Document} from "mongoose";
import * as mongoose from "mongoose";

export interface Tag extends Document {
    email: string;
    firstName: string;
    lastName: string;
}

const UserSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        required: true
    },
    content:{
        type: String,
        required: true
    },
    aliases:{
        type: [String],
        default: [],
        required: true
    },
    created: {
        type: Boolean,
        default: true,
        required: true
    }
});

// Export the model and return your IUser interface
export default mongoose.model<Tag>('tag', UserSchema);