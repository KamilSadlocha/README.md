const express = require('express');
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config({ path: `./.env` });
const emailReadme = process.env.EMAILREADME;
const emailMag = process.env.EMAILMAG;
const emailPassword = process.env.EMAILPASSWORD;
const emailImgSource = process.env.MAIL_IMAGE_SOURCE;

router.post("", (req, res) => {
	const { username, mail, message } = req.body;
	const transporter = nodemailer.createTransport({
		service: "Gmail",
		auth: {
			user: emailReadme,
			pass: emailPassword,
		},
	});

	const mailOptions = {
		from: mail,
		cc: [mail, emailMag],
		to: emailReadme,
		subject: `Readme - more info - ${username}`,
		text: message,
		html: `<b>Hello Readme, ${username} here,</b></br><p>${message}</p>
    <img src="${emailImgSource}" alt="Girl in a jacket">`, // DONE: changed img src to environment variable
		replyTo: mail,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			console.error("Error sending email:", error);
			return res.status(500).send("Error sending email");
		}
		console.log("Email sent successfully");
		res.send("Email sent successfully - backend log");
	});
});

module.exports = router;