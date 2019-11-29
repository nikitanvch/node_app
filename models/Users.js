let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
    email: String,
    pw: String,
});

db = mongoose.createConnection("mongodb://localhost/todo_list", {MongoClient: true});
user = db.model("User", userSchema);
module.exports = user;