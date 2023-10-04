const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const AllBorowedBooksModel = new Schema({
	userId: String,
	userName: String,
    borrowedBook: Object,
});

const AllBorowedBooks = model("AllBorowedBooks", AllBorowedBooksModel);

module.exports = AllBorowedBooks;
