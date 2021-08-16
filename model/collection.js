const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Word = require("./word");

const collectionSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    item_ids: [{type: String}], //has to be processed later in the controllers
    type: {type: String, required: true, enum: ["news", "word"]},
    created_date: {type: Date, default: Date.now(), required: true}
});

collectionSchema.post("findOneAndDelete", async function(doc){
    if(doc.type == "word"){
        await Promise.all(doc.item_ids.map(async (id) => {
            await Word.findByIdAndDelete(id);
        }));
    }
});

module.exports = mongoose.model("Collection", collectionSchema);