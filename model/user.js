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

//encrypt password before storing
userSchema.pre('save', async function(next) {
    const user = this;
    const hash = await bcrypt.hash(this.password, 10);

    this.password = hash;
    next();
  }
);

userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
}  

userSchema.pre('findByIdAndDelete', (next) => {
    //delete all word collection of the user
    this.word_collections.foreach((id) => {
        Collection.findByIdAndDelete(id, (err) => {
            if(err) return next(err);
        });
    });

    //delete all news collection of the user
    this.news_collection.foreach((id) => {
        Collection.findByIdAndDelete(id, (err) => {
            if(err) return next(err);
        });
    });

    next();
});

module.exports = mongoose.model("User", userSchema);