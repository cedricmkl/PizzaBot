import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";
import TagModel, {Tag} from "./TagModel";

export class TagRequest extends Document {
    createdBy: string
    tag: {name: string, content: string, createdAt: Date}
    messageID: string
}

const TagRequestSchema: Schema = new Schema({
    createdBy: {
        type: String,
        required: true
    },
    tag:{
        type: {name: String, content: String, createdAt: Date},
        required: true
    },
    messageID: {
        type: String,
        required: true,
        unique: true
    }
});

// Export the model and return your interface
export default mongoose.model<TagRequest>('tagRequest', TagRequestSchema);