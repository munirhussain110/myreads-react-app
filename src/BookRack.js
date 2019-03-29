import React, { Component } from 'react';
import './App.css';
import BookShelf from './BookShelf';

class BookRack extends Component {
  render() {
    return (
      <div>
        <BookShelf books={this.props.currentlyReading} shelfTitle="Currently Reading" onShelfChange={this.props.onShelfChange} />
        <BookShelf books={this.props.wantToRead} shelfTitle="Want to Read" onShelfChange={this.props.onShelfChange} />
        <BookShelf books={this.props.read} shelfTitle="Read" onShelfChange={this.props.onShelfChange} />
      </div>
    );
  };
}

export default BookRack;