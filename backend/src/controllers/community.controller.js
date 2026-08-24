const Post = require('../models/Post.model');
const apiResponse = require('../utils/apiResponse');

const getPosts = async (req, res) => {
  const posts = await Post.find().populate('author', 'firstName lastName').sort({ createdAt: -1 });
  return apiResponse(res, 200, true, 'Posts fetched', posts);
};

const createPost = async (req, res) => {
  const { content } = req.body;
  const post = await Post.create({
    author: req.user.id,
    content
  });
  await post.populate('author', 'firstName lastName');
  return apiResponse(res, 201, true, 'Post created', post);
};

const likePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post) {
    return apiResponse(res, 404, false, 'Post not found');
  }

  const hasLiked = post.likedBy.includes(req.user.id);
  if (hasLiked) {
    post.likedBy = post.likedBy.filter(userId => userId.toString() !== req.user.id);
    post.likesCount -= 1;
  } else {
    post.likedBy.push(req.user.id);
    post.likesCount += 1;
  }

  await post.save();
  return apiResponse(res, 200, true, 'Post liked status updated', post);
};

const updatePost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  
  const post = await Post.findById(id);
  if (!post) {
    return apiResponse(res, 404, false, 'Post not found');
  }

  if (post.author.toString() !== req.user.id) {
    return apiResponse(res, 403, false, 'Not authorized to edit this post');
  }

  post.content = content;
  await post.save();
  await post.populate('author', 'firstName lastName');

  return apiResponse(res, 200, true, 'Post updated successfully', post);
};

const deletePost = async (req, res) => {
  const { id } = req.params;
  
  const post = await Post.findById(id);
  if (!post) {
    return apiResponse(res, 404, false, 'Post not found');
  }

  if (post.author.toString() !== req.user.id) {
    return apiResponse(res, 403, false, 'Not authorized to delete this post');
  }

  await post.deleteOne();
  return apiResponse(res, 200, true, 'Post deleted successfully');
};

module.exports = { getPosts, createPost, likePost, updatePost, deletePost };
