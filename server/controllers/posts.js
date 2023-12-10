import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.params;
    const user = await User.findById(id);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      picturePath,
      userPicturePath: user.userPicturePath,
      likes: {},
      comments: [],
    });
    await newPost.save();

    const post = Post.find();

    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

/* READ */

export const getFeedPost = async (req, res) => {
  try {
    const post = Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPost = async (req, res) => {
  try {
    /*
    ....to be tested later
    const id = req.params;
    const post = Post.findById(id);
    */
    const { userId } = req.params;
    const post = Post.findById({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

/* UPDATE */

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);
    const isliked = post.likes.get(userId);

    if (isliked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ messsage: error.message });
  }
};
