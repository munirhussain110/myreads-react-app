import React, { Component } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import Book from './Book';

class SearchBooks extends Component {
  state = {
    searchQuery: ''
  };

  handleSearchQuery = (e) => {
    const searchText = e.target.value;
    this.setState({
      searchQuery: searchText
    })
    this.props.onSearchHandler(searchText);
  };

  render() {
    return (
      <div>
        <div>
          <Link to="/">
            <button>Close</button>
          </Link>
          <div>
            <input
              type="text"
              placeholder="Search by title or author"
              onChange={this.handleSearchQuery}
            />
          </div>
        </div>
        <div>
          {
            this.props.searchedBooks.map((eachBook) => 
              <Book book={eachBook} onShelfChange={this.props.onShelfChange} />
            )
          }
          
        </div>
      </div>
    );
  };
}

export default SearchBooks;