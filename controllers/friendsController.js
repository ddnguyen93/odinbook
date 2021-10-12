const User = require("../models/user");
const HttpError = require("../models/http-error");

exports.send_request = async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.userData.userId);
    currentUser.friendRequestSent.push(req.body.otherUserId);
    currentUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    const otherUser = await User.findById(req.body.otherUserId);
    otherUser.friendRequestReceived.push(req.userData.userId);
    otherUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    res.json({ sender: currentUser, receiver: otherUser });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.cancel_request = async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.userData.userId);
    currentUser.friendRequestSent = currentUser.friendRequestSent.filter(
      (id) => id != req.body.otherUserId
    );
    currentUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    const otherUser = await User.findById(req.body.otherUserId);
    otherUser.friendRequestReceived = otherUser.friendRequestReceived.filter(
      (id) => id != req.userData.userId
    );
    otherUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    res.json({ sender: currentUser, receiver: otherUser });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.accept_request = async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.userData.userId);
    currentUser.friends.push(req.body.otherUserId);
    currentUser.friendRequestReceived =
      currentUser.friendRequestReceived.filter(
        (id) => id != req.body.otherUserId
      );
    currentUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    const otherUser = await User.findById(req.body.otherUserId);
    otherUser.friends.push(req.userData.userId);
    otherUser.friendRequestSent = otherUser.friendRequestSent.filter(
      (id) => id != req.userData.userId
    );
    otherUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    res.json({ sender: currentUser, receiver: otherUser });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.decline_request = async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.userData.userId);
    currentUser.friendRequestReceived =
      currentUser.friendRequestReceived.filter(
        (id) => id != req.body.otherUserId
      );
    currentUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    const otherUser = await User.findById(req.body.otherUserId);
    otherUser.friendRequestSent = otherUser.friendRequestSent.filter(
      (id) => id != req.userData.userId
    );
    otherUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    res.json({ sender: currentUser, receiver: otherUser });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};

exports.remove_friend = async function (req, res, next) {
  try {
    const currentUser = await User.findById(req.userData.userId);
    currentUser.friends = currentUser.friends.filter(
      (id) => id != req.body.otherUserId
    );
    currentUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    const otherUser = await User.findById(req.body.otherUserId);
    otherUser.friends = otherUser.friends.filter(
      (id) => id != req.userData.userId
    );
    otherUser.save(function (err) {
      if (err) {
        console.log(err);
        const error = new HttpError(
          "Something went wrong. Could not save to DB.",
          500
        );
        return next(error);
      }
    });

    res.json({ sender: currentUser, receiver: otherUser });
  } catch (err) {
    const error = new HttpError("Something went wrong", 500);
    return next(error);
  }
};
