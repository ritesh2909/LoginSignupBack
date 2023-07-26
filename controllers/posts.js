import Post from "../model/Post.js";
import User from "../model/User.js";

export const getPost = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const createPost = async (req, res) => {
  const user = (await User.find({_id: req.body.userId}))[0]
  if (!user) {
    return res.status(404).json("User not found");
  }
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    return res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
};
