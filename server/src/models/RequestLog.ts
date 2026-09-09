import mongoose, { Document, Schema } from "mongoose";

export interface IRequestLog extends Document {
    apiKey: string;
    endpoint: string;
    method: string;
    statusCode: number;
    responseTime: number;
    ip: string;
    timestamp: Date;
}

const requestLogSchema = new Schema<IRequestLog>(
    {
        apiKey: {
            type: String,
            required: true,
            index: true
        },

        endpoint: {
            type: String,
            required: true
        },

        method: {
            type: String,
            required: true
        },

        statusCode: {
            type: Number,
            required: true
        },

        responseTime: {
            type: Number,
            required: true
        },

        ip: {
            type: String,
            required: true
        },

        timestamp: {
            type: Date,
            default: Date.now,
            index: true
        }
    }
);

const RequestLog = mongoose.model<IRequestLog>(
    "RequestLog",
    requestLogSchema
);

export default RequestLog;