# C21 Book Search Engine

## Description

This application is a book search engine that allows users to search for books, save them to their account, and manage their saved books. It's built with a React frontend, Node.js/Express.js server, and uses GraphQL with Apollo Server for data management.

## Technologies Used

- Frontend: React, Apollo Client, Bootstrap
- Backend: Node.js, Express.js, Apollo Server
- Database: MongoDB with Mongoose ODM
- Authentication: JWT

## Installation

1. Clone the repository
2. Run `npm install` in the root directory
3. Run `npm run install` to install dependencies for both client and server

## Usage

- Development mode: `npm run develop`
- Production build: `npm run build`
- Start server: `npm start`

## Features

- Search for books using the Google Books API
- User authentication (signup/login)
- Save and remove books from user's account
- View saved books

## Deployment

This application is configured for deployment on Render. Ensure all environment variables are set in the Render dashboard.

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT authentication

## Contributing

Contributions to improve the application are welcome. Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the ISC License.