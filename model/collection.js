const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    word_ids: [{type: mongoose.Types.ObjectId}],
    news_ids: [{type: String}],
    type: {type: String, required: true, enum: ["news", "word"]},
    created_date: {type: Date, default: Date.now(), required: true}
});

collectionSchema.virtual("content").get(function(){
    if(this.type === "news") return this.new_ids;
    else return this.word_ids;
});

module.exports = mongoose.model("Collection", collectionSchema);