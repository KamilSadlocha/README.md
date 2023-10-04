const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userModel = new Schema({
	name: String,
	email: String,
	password: String,
	favBooks: Array,
    borrowBooks: Array,
});

const User = model("User", userModel);

module.exports = User;
