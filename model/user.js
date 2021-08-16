const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Collection = require("./collection");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true, maxLength: 50, unique: true},
    fullname: {type: String, required: true, maxLength: 100},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, select: false},
    city: {type: String},
    country: {type: String},
    word_collection: [{type: Schema.Types.ObjectId, ref: 'Collection'}],
    news_collection: [{type: Schema.Types.ObjectId, ref: 'Collection'}],
    created_date: {type: Date, default: Date.now(), required: true}
});

userSchema.methods.isValidPassword = async function(password) {
    const compare = await bcrypt.compare(password, this.password);
    
    return compare;
}  

userSchema.post('findOneAndDelete', async (doc) => {
    //delete all word collection of the user
    await Promise.all(doc.word_collection.map(async (id) => {
        await Collection.findByIdAndDelete(id);
    }));

    //delete all news collection of the user
    await Promise.all(doc.news_collection.map(async (id) => {
        await Collection.findByIdAndDelete(id);
    }));
});

module.exports = mongoose.model("User", userSchema);