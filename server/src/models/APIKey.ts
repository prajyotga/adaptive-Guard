import mongoose, { Document, Schema } from "mongoose";

export interface IAPIKey extends Document {
    key: string;
    name: string;
    rateLimit: number;
    windowSize: number;
    isActive: boolean;
}

const apiKeySchema = new Schema<IAPIKey>(
    {
        key: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true
        },

        rateLimit: {
            type: Number,
            default: 5
        },

        windowSize: {
            type: Number,
            default: 60
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const APIKey = mongoose.model<IAPIKey>("APIKey", apiKeySchema);

export default APIKey;