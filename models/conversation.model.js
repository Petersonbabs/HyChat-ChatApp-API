import { Model, Schema } from "mongoose";

const conversationSchema = new Schema({
    participants: [
        {
            type: Schema.ObjectId,
            ref: 'user',
            required: true
        }
    ],

    messages: [
        {
            type: Schema.ObjectId,
            ref: 'message',
            default: []
        }
    ]
}, { timestamps: true })

const conversationModel = Model('conversation', conversationSchema);

export default conversationModel;