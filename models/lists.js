var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var listSchema = new Schema({
    name:  String,
    id_user: Number,
});

db = mongoose.createConnection('mongodb://localhost/todo_list', {MongoClient: true});
list = db.model("List", listSchema);
module.exports = list;