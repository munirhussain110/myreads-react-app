import React, { Component } from 'react';
import './App.css';
import Book from './Book';

class BookShelf extends Component {
  render() {
    return (
      <div>
        <h2>{this.props.shelfTitle}</h2>
        <div>
          <ol>
            {
              this.props.books.map((eachBook) => 
                <Book book={eachBook} onShelfChange={this.props.onShelfChange} />
              )
            }
          </ol>          
        </div>
      </div>
    );
  };
}

export default BookShelf;