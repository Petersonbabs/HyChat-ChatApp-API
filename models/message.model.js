import { Schema, Model } from "mongoose";

const messageSchema = new Schema({
    id: {
        type: Number,
        required: true
    },

    senderId: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },

    recieverId: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    },

    message: {
        type: String,
        required: true
    }
}, {timestamps: true})

const message = Model('message', messageSchema)

export default message