import "../BookCard/BookCard.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const loggedUser = JSON.parse(localStorage.getItem("user"));

function UserFavourite({ books, title, sliderName, onAddBookToUser }) {
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

	async function removeFromFavourites(id, book) {
		await fetch(`http://localhost:3000/remove-favBook/${id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				googleBookid: book.googleBookid,
			}),
		});
		onAddBookToUser();
	}

	return (
		<>
			{loggedUser ? (
				<div>
					<h1>{title}</h1>
					<Slider {...settings}>
						{books.map((book) => (
							<div key={book.googleBookid} className="fav-book-container">
								<img
									className="thumbnail"
									onClick={() => window.open(book.bookLink)}
									src={book.bookImage}
									alt={book.bookTitle}
								/>
								<div className="details">
									<p>{book.bookTitle} </p>
									<p>{book.bookAuthors}</p>
								</div>
								{sliderName === "favourite" ? (
									<div className="icon">
										<img
											onClick={() =>
												removeFromFavourites(loggedUser.userId, book)
											}
											className="fav"
											src="./favorite.png"
											alt="fav"
										/>
									</div>
								) : (
									""
								)}
							</div>
						))}
					</Slider>
				</div>
			) : (
				""
			)}
		</>
	);
}

export default UserFavourite;
