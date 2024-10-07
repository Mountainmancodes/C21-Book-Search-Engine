# C21 Book Search Engine

## Description

This application is a book search engine that allows users to search for books, save them to their account, and manage their saved books. It's built with a React frontend, Node.js/Express.js server, and uses GraphQL with Apollo Server for data management.

## Technologies Used

- Frontend: React, Apollo Client, Bootstrap
- Backend: Node.js, Express.js, Apollo Server
- Database: MongoDB with Mongoose ODM
- Authentication: JWT
- CORS: Cross-Origin Resource Sharing
- dotenv: For managing environment variables

## Features

- Search for books using the Google Books API
- User authentication (signup/login)
- Save and remove books from user's account
- View saved books

## Usage

1. **Searching for Books**  
   Navigate to the search page and enter a book title or author into the search bar. Hit the search button to query the Google Books API and retrieve results.

2. **Creating an Account/Logging In**  
   Users must sign up or log in to access the save functionality. Create a new account or log in to an existing account from the **Sign Up** or **Login** pages.

3. **Saving a Book**  
   When viewing search results, you can click the "Save this Book" button to add a book to your account. You must be logged in to save books.

4. **Viewing Saved Books**  
   Once logged in, go to the **Saved Books** page to see all the books you've saved.

5. **Removing a Book**  
   On the **Saved Books** page, click the "Delete this Book" button to remove a book from your saved list.

## Examples

### Live Demo

You can try the app live here: [C21 Book Search Engine](https://c21-book-search-engine-y1ui.onrender.com)

### Screenshots

#### Example 1: Book Search Results

![Book Search Results](./images/C21%20Example%201.png)

#### Example 2: Books Saved List

![Books Saved List](./images/C21%20Example%202.png)

## Contributing

This project is based on code provided by [coding-boot-camp/solid-broccoli:main](https://github.com/coding-boot-camp/solid-broccoli).

- Modified by [Mountainmancodes](https://github.com/Mountainmancodes).
- Code assistance from [Lixiviate](https://github.com/Lixiviate)

## License

This project is licensed under the ISC License.
