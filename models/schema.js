
var mongo = require("mongoose");

var schema = new mongo.Schema({
ide:String,
likescount: String
});

module.exports = new mongo.model("schema", schema);