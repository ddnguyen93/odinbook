var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PostSchema = new Schema(
    {
        author: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        description: {type: String, required: true},
        date_of_post: {type: Date},
        likes: [{type: Schema.Types.ObjectId, ref: 'User'}],
        comments: [{type: Schema.Types.ObjectId, ref: 'PostComment'}]
    }
)

module.exports = mongoose.model('Post', PostSchema)