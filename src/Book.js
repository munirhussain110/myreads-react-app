import React from 'react';
import './App.css';

function Book(props) {
  const { book, onShelfChange } = props;  
    return (
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            {
              (book.imageLinks) &&
              <div className="book-cover"
                style={{
                  width: 128,
                  height: 193,
                  backgroundImage: `url(${book.imageLinks.thumbnail})`
                }}
              ></div>
            }
            <div className="book-shelf-changer">
              <select
                id={book.id}
                value={(book.shelf) ? book.shelf : 'none'}
                onChange={(event) => onShelfChange(book, event.target.value)}
              >
                <option value="move" disabled>Move to...</option>
                <option value="currentlyReading" >Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">
            {book.title}
          </div>
          <div className="book-authors">
            {
              (book.authors) && `${book.authors.join(', ')}`
            }
          </div>
        </div>
      </li>
    );
}

export default Book;