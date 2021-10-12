var PostComment = require("../models/postcomment");
var Post = require("../models/post");

const HttpError = require("../models/http-error");

exports.comment_detail = function (req, res, next) {
  PostComment.findById(req.params.id)
    .populate("author")
    .exec(function (err, comment) {
      if (err) {
        return next(err);
      }
      res.json(comment);
    });
};

exports.comment_create = async function (req, res, next) {
  try {
    var comment = new PostComment({
      author: req.userData.userId,
      text: req.body.text,
      date_of_post: new Date(),
    });

    comment.save(function (err) {
      if (err) {
        const error = new HttpError(
          "Something went wrong. Could not save comment to DB.",
          500
        );
        return next(error);
      }
    });

    var post = await Post.findById(req.body.postId);
    post.comments.push(comment.id);
    await post.save();
    const updatedPost = await Post.findById(req.body.postId).populate({
      path: "comments",
      populate: { path: "author" },
    });
    res.json({ comments: updatedPost.comments });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};
