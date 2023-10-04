import { useState } from 'react';
import './Search.css';
import BookCardElement from '../BookCardElement.js/BookCardElement';
import googleBooksApi from '../../api-key';

const Search = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  async function handleSearchBooks() {
    try {
      let response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&key=${googleBooksApi}`
      );
      if (!response.ok) {
        throw new Error('Search failed');
      }
      response = await response.json();
      console.log(data.items);
      setBooks(data.items);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
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
      <div className="book-results">
        {books.map((book) => (
          <BookCardElement
            key={book.id}
            title={book.volumeInfo.title}
            author={book.volumeInfo.authors ? book.volumeInfo.authors[0] : 'Unknown'}
            thumbnail={book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : null}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
