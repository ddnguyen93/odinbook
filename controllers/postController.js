var Post = require("../models/post");
const HttpError = require("../models/http-error");

exports.post_list = function (req, res, next) {
  Post.find()
    .sort([["date_of_post", "descending"]])
    .populate("author")
    .populate({
      path: "comments",
      populate: { path: "author" },
    })
    .exec(function (err, list_posts) {
      if (err) {
        return next(err);
      }
      res.json(list_posts);
    });
};

exports.post_create = async function (req, res, next) {
  try {
    var post = new Post({
      author: req.userData.userId,
      description: req.body.description,
      date_of_post: new Date(),
    });
    post.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save user to DB.",
          500
        );
        return next(error);
      }
      res.json({ message: "Post successfully saved" });
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.post_like = async function (req, res, next) {
  try {
    Post.findById(req.body.postId, function (err, post) {
      if (err) {
        new HttpError("Something went wrong", 500);
        return next(error);
      }
      if (!req.body.likedPost) {
        post.likes.push(req.userData.userId);
      } else {
        post.likes = post.likes.filter((id) => id != req.userData.userId);
      }

      post.save(function (err) {
        if (err) {
          const error = new HttpError(
            "Something went wrong. Could not save comment to DB.",
            500
          );
          return next(error);
        }
      });
      res.json({ post: post });
    });
  } catch (err) {
    console.log(err);
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};
