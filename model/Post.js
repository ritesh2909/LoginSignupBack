import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    userId: {
        type: String,
    }
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

export default Post;