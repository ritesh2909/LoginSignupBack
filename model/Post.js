import mongoose from "mongoose";

const PostSchema = new mongoose.model({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    userId: {
        type: String,
    },
    image: {
        type: [String]
    }
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);