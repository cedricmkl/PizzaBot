import { model, Document, Schema } from "mongoose";

export class Tag extends Document {
    name: string
    createdAt: Date
    content: string
    aliases: string[]
}

const TagSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    content: {
        type: String,
        required: true
    },
    aliases: {
        type: [String],
        default: [],
        required: true
    }
});

export default model<Tag>('tag', TagSchema);