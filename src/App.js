import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import { Route, Link } from 'react-router-dom';
import BookRack from './BookRack';
import SearchBooks from './SearchBooks';
import * as BooksApi from './BooksAPI';

class App extends Component {
  state = {
    currentlyReading: [],
    wantToRead: [],
    read: [],
    searchedBooks: []
  };

  loadAllBooks = () => {
    BooksApi.getAll()
      .then((allBooks) => {
        var currentlyReading = [],
          wantToRead = [],
          read = [];
          
        allBooks.map((book) => {          
          switch (book.shelf) {
            case 'currentlyReading':
              currentlyReading.push(book);
              return null;
            case 'wantToRead':
              wantToRead.push(book);
              return null;
            case 'read':
              read.push(book);
              return null;
            default:
              return null;
          }
        })

        this.setState({
          currentlyReading: currentlyReading,
          wantToRead: wantToRead,
          read: read,
          searchedBooks: []          
        })
      })
      .catch((err) => {
        console.log("Error during loading all books", err);        
      })
  };

  componentDidMount() {
    this.loadAllBooks();
  };

  handleShelfChange = (selectedBook, newShelf) => {
    var existingShelf = selectedBook.shelf;

    var currentShelfBooksUpdated = (existingShelf !== 'none')
      ? this.state[existingShelf].filter((eachBook) => eachBook.id !== selectedBook.id)
      : null;

    selectedBook.shelf = newShelf;

    //optimistic updates for better user experience
    if (newShelf !== 'none' && existingShelf !== 'none') {
      this.setState((prevState) => ({
        [existingShelf]: currentShelfBooksUpdated,
        [newShelf]: [...prevState[newShelf], selectedBook],
      }))
    }
    else if (existingShelf === 'none') {
      this.setState((prevState) => ({
        [newShelf]: [...prevState[newShelf], selectedBook],
      }))
    }
    else if (newShelf === 'none') {
      this.setState({ [existingShelf]: currentShelfBooksUpdated, })
    }

    BooksApi.update(selectedBook, newShelf)
      .then(() => {
        console.log("Book shelf changed and updated at server")
      })
      .catch((err) => {
        console.log("Error while updating shelf", err)

        //  In case of failure response from server following will revert
        //  to prev state because was optimistic updates        

        let currentShelfBooksUpdated = (newShelf !== 'none')
          ? this.state[newShelf].filter((rec) => rec.id !== selectedBook.id)
          : null;

        selectedBook.shelf = existingShelf;

        if (newShelf !== 'none' && existingShelf !== 'none') {
          this.setState((prevState) => ({
            [newShelf]: currentShelfBooksUpdated,
            [existingShelf]: [...prevState[existingShelf], selectedBook],
          }))
        }
        else if (existingShelf === 'none') {
          this.setState({
            [newShelf]: currentShelfBooksUpdated,
          })
        }
        else if (newShelf === 'none') {
          this.setState((prevState) => ({
            [existingShelf]: [...prevState[existingShelf], selectedBook],
          }))
        }
      });
  };

  getBookShelf(bookId) {
    const allBooks = [...this.state.currentlyReading, ...this.state.wantToRead, ...this.state.read];
    let selectedBook = allBooks.filter((book) => book.id === bookId);    
    return (selectedBook.length !== 0) ? selectedBook[0].shelf : 'none';
  }

  handleBookSearch = (searchQuery) => {
    (searchQuery)
      ? BooksApi.search(searchQuery)
        .then((books) => {
          if (books.error) {
            this.setState({
              searchedBooks: []
            });
            return;
          }
          var newBooks = books.map((book) => {            
            book.shelf = this.getBookShelf(book.id);
            return book;
          })

          this.setState({ searchedBooks: newBooks })
        })
      : this.setState({
        searchedBooks: []
      })
  };

  render() {
    return (
      <div>
        <header>          
          <p>
            My Reads
          </p>          
        </header>
        <Route exact path="/" render={() => (
          <BookRack
            currentlyReading={this.state.currentlyReading}
            wantToRead={this.state.wantToRead}
            read={this.state.read}  
            onShelfChange={this.handleShelfChange}
          />)}
        />
        <Route exact path="/search" render={() => (
          <SearchBooks
            searchedBooks={this.state.searchedBooks}
            onShelfChange={this.handleShelfChange}
            onSearchHandler={this.handleBookSearch}
          />)}
        />
        <footer>
          <div>
            <Link to="/search">
              <button>Search Books</button>
            </Link>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
