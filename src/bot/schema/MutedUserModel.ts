import * as mongoose from "mongoose";
import {Document, Schema} from "mongoose";

export class MutedUser extends Document {
    id: string
    reason: String
    mutedAt: Date
    unmuteAt: Date

    async unmute() : Promise<MutedUser> {
        return this.delete();
    }

    isPermanent() : boolean{
        return !this.unmuteAt
    }
}

const MutedUserSchema: Schema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    reason: {
        type: String,
        default: "Nicht angegeben",
        required: true
    },
    mutedAt: {
        type: Date,
        default: Date.now(),
        required: true
    },
    unmuteAt: {
        type: Date,
        required: false
    }
});

// Export the model and return your interface
export default mongoose.model<MutedUser>('MutedUser', MutedUserSchema);