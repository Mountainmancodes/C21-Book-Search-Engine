export const searchGoogleBooks = (query) => {
  return fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }`
  );
};