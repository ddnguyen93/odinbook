var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostCommentSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        text: {type: String, required: true},
        date_of_post: {type: Date}
    }
)

module.exports = mongoose.model('PostComment', PostCommentSchema)