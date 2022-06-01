import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

export class CustomColor extends Document {
    userId: string
    roleId: string
}

const CustomColorSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    roleId: {
        type: String,
        required: true,
        unique: true
    }
});


export default mongoose.model<CustomColor>('CustomColor', CustomColorSchema);