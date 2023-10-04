"use strict";

const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const emailRouter = require("./router/emailRouter.js")
const User = require("./model/User.js");
const AllBorowedBooks = require("./model/AllBorowedBooks.js");

dotenv.config({ path: `./.env` });
const port = process.env.PORT;

const DB = process.env.DATABASE.replace(
	`<password>`,
	process.env.DATABASE_PASSWORD
);

const app = express();
app.use(express.json());
app.use(cors());
app.use("/send-email", emailRouter);

app.post("/addBorrowedBookToDatabase", async (req, res) => {
	const { userId, userName, borrowedBook } = req.body;
	try {
		const book = new AllBorowedBooks({
			userId,
			userName,
			borrowedBook,
		});

		await book.save();
		res.status(201).json({ message: "Book added successfully", book });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});

app.get("/addBorrowedBookToDatabase", async (req, res) => {
	try {
		const todos = await AllBorowedBooks.find();
		res.json(todos);
	} catch (error) {
		console.error("Error fetching data:", error);
		res.status(500).send("Server error");
	}
});

app.delete("/removeBorrowedBook", async (req, res) => {
	const userId = req.body.userId;
	const bookIdToRemove = req.body.bookId;

	try {
		const result = await User.findOneAndUpdate(
			{ _id: userId },
			{ $pull: { borrowBooks: { googleBookid: bookIdToRemove } } },
			{ new: true }
		);

		if (result) {
			console.log("Book removed from user borrow list:", result);
			res.json({
				status: "success",
				message: "Book removed from user borrow list",
			});
		} else {
			console.log("User not found");
			res.status(404).json({ status: "fail", message: "User not found" });
		}
	} catch (err) {
		console.log("Error removing book from user borrow list", err);
		res.status(500).json({
			status: "fail",
			message: "An error occurred while removing book from user borrow list",
		});
	}
});

app.get("/user/:id", async (req, res) => {
	const id = req.params.id;
	const user = await User.findById(id);
	res.json(user);
});
app.get("/user/", async (req, res) => {
	const users = await User.find();
	res.json(users);
});

app.patch("/remove-favBook/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const { googleBookid } = req.body;
		const result = await User.findByIdAndUpdate(
			{ _id: id },
			{ $pull: { favBooks: { googleBookid } } }
		);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.patch("/add-borrowBook/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const { borrowBooks } = req.body;
		const result = await User.findByIdAndUpdate(
			{ _id: id },
			{ $push: { borrowBooks: borrowBooks } }
		);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.patch("/add-favBook/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const { favBooks } = req.body;

		const result = await User.findByIdAndUpdate(
			{ _id: id },
			{ $push: { favBooks: favBooks } }
		);

		res.json(result);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.patch("/add-borrowBook/:id", async (req, res) => {
	try {
		const id = req.params.id;
		const { borrowBooks } = req.body;
		const result = await User.findByIdAndUpdate(
			{ _id: id },
			{ $push: { borrowBooks: borrowBooks } }
		);
		res.json(result);
	} catch (err) {
		console.error(err);
		res.sendStatus(500);
	}
});

app.post("/login", async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({ error: "Invalid email or password" });
	}
	if (password !== user.password) {
		return res.status(401).json({ error: "Invalid email or password" });
	}
	res.json({ userId: user._id, name: user.name });
});

app.post("/register", async (req, res) => {
	const { name, email, password, favBooks, borrowBooks } = req.body;
	try {
		const user = new User({
			name,
			email,
			password,
			favBooks,
			borrowBooks,
		});

		await user.save();
		res.status(201).json({ message: "User created successfully", user });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
});


app.listen(port, () => {
	console.log(`App running on port ${port}...link http://127.0.0.1:${port}`);
});

mongoose
	.connect(DB)
	.then(console.log("DataBase is connected"))
	.catch((err) => console.log(err));
