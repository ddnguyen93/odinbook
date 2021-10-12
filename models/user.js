var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  date_of_birth: { type: Date },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequestReceived: [{ type: Schema.Types.ObjectId, ref: "User" }],
  friendRequestSent: [{ type: Schema.Types.ObjectId, ref: "User" }],
  hometown: { type: String },
  school: { type: String },
  employer: { type: String },
  picture: { type: String },
  picture_type: { type: String },
});

UserSchema.virtual("url").get(function () {
  return "/user/" + this.id;
});

// UserSchema.virtual("ImagePath").get(function () {
//   if (this.picture != null && this.picture_type != null) {
//     return `data:${this.picture_type};charset=utf-8;base64,${this.picture}`;
//   }
// });

//Export model
module.exports = mongoose.model("User", UserSchema);
