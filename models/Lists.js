var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var listSchema = new Schema({
    name:  String,
    user_id: { type: Schema.Types.ObjectId, ref: "Users", index: true},
});

db = mongoose.createConnection("mongodb://localhost/todo_list", {MongoClient: true});
list = db.model("List", listSchema);
module.exports = list;