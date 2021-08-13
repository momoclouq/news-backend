const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Word = require("./word");

const collectionSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    item_ids: [{type: String}], //has to be processed later in the controllers
    type: {type: String, required: true, enum: ["news", "word"]},
    created_date: {type: Date, default: Date.now(), required: true}
});

collectionSchema.pre("findByIdAndDelete", function(next){
    if(this.type == "word"){
        this.item_ids.foreach((id) => {
            Word.findByIdAndDelete(new mongoose.Types.ObjectId(id), (err) => {
                if(err) return next(err);
            });
        });
    }
    next();
});

module.exports = mongoose.model("Collection", collectionSchema);