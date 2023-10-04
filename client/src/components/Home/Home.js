import "./Home.css";
import React, { useState, useEffect } from "react";
import BookCard from "../BookCard/BookCard";
import googleBooksApi from "../../api-key";
import { GOOGLEAPI_URL } from "../../env.js";
import UserFavourite from "../UserFavourite/UserFavourite";
import ModalBorrow from "./ModalBorrow";
const loggedUser = JSON.parse(localStorage.getItem("user"));

const Home = () => {
	const [popularBooks, setPopularBooks] = useState([]);
	const [newestBooks, setNewestBooks] = useState([]);
	const [foundBooks, setFoundBooks] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [user, setUser] = useState("");
	const [modal, setModal] = useState(false);
	const [borrowedBooks, setBorrowedBooks] = useState([]);
	const [allUsers, setAllUsers] = useState([]);

	const closeModal = () => {
		setModal(false);
	};

	async function fetchUser() {
		if (loggedUser) {
			const response = await fetch(
				`http://localhost:3000/user/${loggedUser.userId}`
			);
			const data = await response.json();
			setUser(data);
		}
	}

	useEffect(() => {
		fetchUser();
	}, []);

	async function fetchBorrowedBook() {
		try {
			const response = await fetch(
				"http://localhost:3000/addBorrowedBookToDatabase"
			);
			const data = await response.json();
			setBorrowedBooks(data);
			console.log(borrowedBooks);
		} catch (error) {
			console.error(error);
		}
	}

	async function fetchUsers() {
		try {
			const response = await fetch("http://localhost:3000/user");
			const data = await response.json();
			setAllUsers(data);
			console.log(allUsers);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchUser();
	}, []);
	useEffect(() => {
		fetchBorrowedBook();
	}, []);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchBooks = async (url, setData) => {
		try {
			const response = await fetch(`${url}&key=${googleBooksApi}`);
			const data = await response.json();
			setData(data.items);
		} catch (err) {
			console.error(err);
		}
	};

	const handleSearchBooks = () => {
		console.log(GOOGLEAPI_URL);
		fetchBooks(
			`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`,
			setFoundBooks
		);
	};

	const handleInputChange = (event) => {
		setSearchTerm(event.target.value);
	};

	useEffect(() => {
		fetchBooks(
			`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&minRating=4.5&maxResults=40&orderBy=relevance`,
			setPopularBooks
		);
		fetchBooks(
			`https://www.googleapis.com/books/v1/volumes?q=subject:fiction&orderBy=newest&printType=books&maxResults=40`,
			setNewestBooks
		);
	}, []);

	async function removeBorrowedBook(userId, bookId) {
		try {
			const response = await fetch("http://localhost:3000/removeBorrowedBook", {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId: userId, bookId: bookId }),
			});
			const data = await response.json();
			fetchUsers()
			if (response.ok) {
				console.log("Book removed from user borrow list");
				return data;
			} else {
				console.log("Error removing book from user borrow list:", data.message);
				throw new Error(data.message);
			}
		} catch (err) {
			console.log(
				"An error occurred while removing book from user borrow list:",
				err.message
			);
			throw new Error(
				"An error occurred while removing book from user borrow list"
			);
		}
		
	}

	return (
		<>
			<ModalBorrow open={modal} close={closeModal} />

			{loggedUser === null || loggedUser.name !== "Pan Bibliotekarz"  ? (
				<>
					<div className="search-container">
						<div className="book-search">
							<input
								className="search-input"
								type="text"
								placeholder="Search by title..."
								value={searchTerm}
								onChange={handleInputChange}
							/>
							<button className="search-button" onClick={handleSearchBooks}>
								<img className="loupe" src="./loupe.png" alt="loupe"></img>
							</button>
						</div>
					</div>
					{foundBooks.length > 0 && (
						<BookCard
							userFavBooks={user.favBooks}
							books={foundBooks}
							category={`Search results for "${searchTerm}":`}
							modalState={modal}
							modalStateFunction={setModal}
							onAddBookToUser={fetchUser}
						/>
					)}
					<>
						{user && user.favBooks.length > 0 ? (
							<div>
								<UserFavourite
									books={user.favBooks}
									title={"Your Favourite:"}
									sliderName={"favourite"}
									onAddBookToUser={fetchUser}
								/>
							</div>
						) : (
							""
						)}

						{user && user.borrowBooks.length > 0 ? (
							<div>
								<UserFavourite
									books={user.borrowBooks}
									title={"Your Borrowed Books:"}
									sliderName={"borrowed"}
								/>{" "}
							</div>
						) : (
							""
						)}
					</>
					<BookCard
						userFavBooks={user.favBooks}
						books={popularBooks}
						category={"Most Popular Books:"}
						modalState={modal}
						modalStateFunction={setModal}
						onAddBookToUser={fetchUser}
					/>
					<BookCard
						userFavBooks={user.favBooks}
						books={newestBooks}
						category={"Newest Books:"}
						modalState={modal}
						modalStateFunction={setModal}
						onAddBookToUser={fetchUser}
					/>
				</>
			) : (
				<table>
					<tbody>
						<tr>
							<td colSpan="2" className="table-title bigger-font">
								Borrowed Books
							</td>
						</tr>
						<tr>
							<td className="smaller-font user-col">User</td>
							<td className="smaller-font books-col">Books</td>
						</tr>
						{allUsers.map((user, index) => (
							<tr key={index}>
								<td className="smaller-font user-col email-cell">
									{user.email}
								</td>
								<td>
									<ul className="books-list">
										{user.borrowBooks.map((book, index) => (
											<li key={index}>
												<span className="book-title smaller-font">
													{book.bookTitle}
												</span>

												<button
													className="return-button"
													onClick={() => {
														removeBorrowedBook(user._id, book.googleBookid);
													}}
												>
													Return book
												</button>
											</li>
										))}
									</ul>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</>
	);
};

export default Home;
