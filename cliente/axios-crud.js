// cliente/axios-crud.js
const axios = require('axios');

// Tarefa 10 - Callback assíncrono
function getAllBooks(callback) {
  axios.get('http://localhost:3000/books')
    .then(response => callback(null, response.data))
    .catch(error => callback(error));
}

// Tarefa 11 - Promises
function getBookByISBN(isbn) {
  return axios.get(`http://localhost:3000/books/isbn/${isbn}`);
}

// Tarefa 12 - Promises
function getBooksByAuthor(author) {
  return axios.get(`http://localhost:3000/books/author/${author}`);
}

// Tarefa 13 - Promises
function getBooksByTitle(title) {
  return axios.get(`http://localhost:3000/books/title/${title}`);
}

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};