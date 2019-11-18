var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    pw: String,
});

db = mongoose.createConnection('mongodb://localhost/todo_list', {MongoClient: true});
user = db.model("User", userSchema);
module.exports = user;