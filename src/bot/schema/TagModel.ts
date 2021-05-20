import {Schema, Document} from "mongoose";
import * as mongoose from "mongoose";

export interface Tag extends Document {
    name: string,
    createdAt: Date,
    content: string,
    aliases: string[],
    created: boolean
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
    },
    created: {
        type: Boolean,
        default: true,
        required: true
    }
});

// Export the model and return your Tag interface
export default mongoose.model<Tag>('tag', TagSchema);