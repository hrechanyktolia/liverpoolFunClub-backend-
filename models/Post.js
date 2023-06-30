import mongoose from "mongoose"
import User from "./User.js";

const PostSchema = new mongoose.Schema({
        text : {
            type: String,
            required: true,
        },
        tags: {
            type: Array,
            default: [],
        },
        viewsCount: {
            type: Number,
            default: 0,

        },
        likesCount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: User,
            required: true,
        },
        imageUrl: String,
        comments: [
            {
                text: String,
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: User,
                },
                fullName: String,
                avatar: String,
            },
        ],
    },
    {
        timestamps: true
    }
)



export default mongoose.model('Post', PostSchema)