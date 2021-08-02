const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true, maxLength: 50, unique: true},
    fullname: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    city: {type: String},
    country: {type: String},
    word_collections: [{type: Schema.Types.ObjectId, ref: 'Collection'}],
    news_collection: [{type: Schema.Types.ObjectId, ref: 'Collection'}],
    created_date: {type: Date, default: Date.now(), required: true}
});

module.exports = mongoose.model("User", userSchema);