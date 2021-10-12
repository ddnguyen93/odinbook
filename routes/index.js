var express = require("express");
var router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

var user_controller = require("../controllers/userController");
var post_controller = require("../controllers/postController");
var comment_controller = require("../controllers/commentController");
var auth_controller = require("../middleware/checkAuthentication");
var friends_controller = require("../controllers/friendsController");

// router.get("/homepage", checkAuthentication);

router.get("/posts", post_controller.post_list);
router.post(
  "/posts",
  auth_controller.checkAuthentication,
  post_controller.post_create
);

router.post(
  "/post/like",
  auth_controller.checkAuthentication,
  post_controller.post_like
);

router.get("/comment/:id", comment_controller.comment_detail);

router.post(
  "/comment/create",
  auth_controller.checkAuthentication,
  comment_controller.comment_create
);

router.get(
  "/users",
  auth_controller.checkAuthentication,
  user_controller.user_list
);

router.get("/user/:id/profile", user_controller.user_profile);

router.get(
  "/user/:id",
  auth_controller.checkAuthentication,
  user_controller.user_find
);

router.post("/registration", user_controller.user_create);

router.post(
  "/user/update",
  upload.single("file"),
  auth_controller.checkAuthentication,
  user_controller.user_update
);

router.post("/log-in", user_controller.user_login);

router.get(
  "/auto-login",
  auth_controller.checkAuthentication,
  user_controller.user_auto_login
);

router.post(
  "/users/send_request",
  auth_controller.checkAuthentication,
  friends_controller.send_request
);

router.post(
  "/users/cancel_request",
  auth_controller.checkAuthentication,
  friends_controller.cancel_request
);

router.post(
  "/users/accept_request",
  auth_controller.checkAuthentication,
  friends_controller.accept_request
);

router.post(
  "/users/decline_request",
  auth_controller.checkAuthentication,
  friends_controller.decline_request
);

router.post(
  "/users/remove_friend",
  auth_controller.checkAuthentication,
  friends_controller.remove_friend
);

module.exports = router;
