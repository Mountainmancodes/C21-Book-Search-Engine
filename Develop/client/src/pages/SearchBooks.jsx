import { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row,
  Alert
} from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';
import { SAVE_BOOK } from '../mutations';

// Debounce hook to delay search execution
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const searchCache = new Map();
let lastRequestTime = 0;
const minRequestInterval = 5000;

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [saveBook] = useMutation(SAVE_BOOK);

  // Use the debounce hook for the search input
  const debouncedSearchInput = useDebounce(searchInput, 500);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const searchGoogleBooks = useCallback(async (query) => {
    if (searchCache.has(query)) {
      setSearchedBooks(searchCache.get(query));
      return;
    }

    const now = Date.now();
    if (now - lastRequestTime < minRequestInterval) {
      const waitTime = minRequestInterval - (now - lastRequestTime);
      setErrorMessage(`Please wait ${Math.ceil(waitTime / 1000)} seconds before trying again.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=20`);
      lastRequestTime = Date.now();

      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few seconds.');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch books. Please try again later.');
      }

      const data = await response.json();
      const items = data.items || [];

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description || 'No description available',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      searchCache.set(query, bookData);
      setSearchedBooks(bookData);

      if (bookData.length === 0) {
        setErrorMessage('No books found. Try a different search term.');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Trigger search when the debounced value changes
  useEffect(() => {
    if (debouncedSearchInput) {
      searchGoogleBooks(debouncedSearchInput);
    }
  }, [debouncedSearchInput, searchGoogleBooks]);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (!searchInput) return;
    searchGoogleBooks(searchInput);
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: { ...bookToSave } },
      });
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                  disabled={isLoading}
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type='submit' variant='success' size='lg' disabled={isLoading}>
                  {isLoading ? 'Searching...' : 'Submit Search'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <h2 className='pt-5'>
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;
