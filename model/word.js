const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const wordSchema = new Schema({
    value: {type: String, required: true},
    note: {type: String, maxLength: 200}
});

module.exports = mongoose.model("Word", wordSchema);