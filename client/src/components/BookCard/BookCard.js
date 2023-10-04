import React, { useState } from "react";
import "./BookCard.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const user = JSON.parse(localStorage.getItem("user"));

const BookCard = ({
	category,
	books,
	modalState,
	modalStateFunction,
	userFavBooks,
	onAddBookToUser,
}) => {
	async function addFavBook(id, favBook) {
		if (
			userFavBooks.find((book) => book.googleBookid === favBook.googleBookid)
		) {
			await fetch(`http://localhost:3000/remove-favBook/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					googleBookid: favBook.googleBookid,
				}),
			});
		} else {
			await fetch(`http://localhost:3000/add-favBook/${id}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					favBooks: favBook,
				}),
			});
		}

		onAddBookToUser();
	}

	function isFavourite(bookId, userFavBooks) {
		if (user && userFavBooks) {
			if (userFavBooks.find((book) => book.googleBookid === bookId)) {
				return "./favorite.png";
			} else {
				return "./NOTfavourite.png";
			}
		} else {
			return "./NOTfavourite.png";
		}
	}

	async function addBorrowBook(id, borrowBook) {
		await fetch(`http://localhost:3000/add-borrowBook/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				borrowBooks: borrowBook,
			}),
		});
		onAddBookToUser();
	}

	async function addBorrowBookToDatabase(userId, userName, borrowedBook) {
		const data = { userId, userName, borrowedBook };
		fetch("http://localhost:3000/addBorrowedBookToDatabase", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	const renderBook = (book, modalState, modalStateFunction) => {
		const bookSchema = {
			googleBookid: book.id,
			bookTitle: book.volumeInfo.title,
			bookAuthors:
				book.volumeInfo.authors && book.volumeInfo.authors.join(", "),
			bookImage: book.volumeInfo.imageLinks
				? book.volumeInfo.imageLinks.thumbnail
				: "https://www.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg",
			bookLink: book.volumeInfo.infoLink,
		};
		return (
			<div key={book.id} className="book-container">
				<img
					className="thumbnail"
					onClick={() => window.open(book.volumeInfo.infoLink)}
					src={
						book.volumeInfo.imageLinks
							? book.volumeInfo.imageLinks.thumbnail
							: "https://www.shutterstock.com/image-vector/ui-image-placeholder-wireframes-apps-260nw-1037719204.jpg"
					}
					alt={book.volumeInfo.title}
				/>
				<div className="details">
					<p>{book.volumeInfo.title} </p>
					<p>{book.volumeInfo.authors && book.volumeInfo.authors.join(", ")}</p>
				</div>
				<div className="icon">
					<img
						className="fav"
						src={isFavourite(book.id, userFavBooks)}
						alt="fav"
						onClick={() => {
							addFavBook(user.userId, bookSchema);
						}}
					/>
					<img
						className="basket"
						src="./basket.png"
						alt="basket"
						onClick={() => {
							addBorrowBook(user.userId, bookSchema);
							addBorrowBookToDatabase(user.userId, user.name, bookSchema);
							modalStateFunction(true);
						}}
					/>
				</div>
			</div>
		);
	};

	//Przenieść do oddzielnego pliku
	const settings = {
		dots: true,
		infinite: true,
		speed: 4000,
		autoplay: true,
		slidesToShow: 4,
		slidesToScroll: 4,
		initialSlide: 0,
		adaptiveHeight: true,
		adeptiveWidth: true,
		arrow: true,

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	return (
		<div>
			<h1 className="category">{category}</h1>
			<Slider {...settings}>
				{books.map((book) => renderBook(book, modalState, modalStateFunction))}
			</Slider>
		</div>
	);
};

export default BookCard;
