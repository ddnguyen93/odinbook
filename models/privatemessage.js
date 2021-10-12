var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PrivateMessageSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  userReceived: { type: Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  date_of_post: { type: Date },
});

module.exports = mongoose.model("PrivateMessage", PrivateMessageSchema);
