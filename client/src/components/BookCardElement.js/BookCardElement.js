import React from 'react';

const BookCardElement = ({ title, author, thumbnail }) => {
    return (
        <div className="book-card">
            {thumbnail && <img className="book-thumbnail" src={thumbnail} alt={title} />}
            <h3 className="book-title">{title}</h3>
            <p className="book-author">by {author}</p>
        </div>
    );
};

export default BookCardElement;