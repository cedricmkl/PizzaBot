import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

export interface Tag extends Document {
    name: string,
    createdAt: Date,
    content: string,
    aliases: string[],
}

const TagSchema: Schema = new Schema({
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
    }
});

// Export the model and return your Tag interface
export default mongoose.model<Tag>('tag', TagSchema);