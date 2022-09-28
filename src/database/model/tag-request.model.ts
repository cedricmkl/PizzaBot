import { model, Document, Schema } from "mongoose";

export class TagRequest extends Document {
    createdBy: string
    tag: { name: string, content: string, createdAt: Date }
    messageID: string
}

const TagRequestSchema: Schema = new Schema({
    createdBy: {
        type: String,
        required: true
    },
    tag: {
        type: { name: String, content: String, createdAt: Date },
        required: true
    },
    messageID: {
        type: String,
        required: true,
        unique: true
    }
});

export default model<TagRequest>('tagRequest', TagRequestSchema);