// server/server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const app = express();

app.use(express.json());
app.use(session({ secret: 'livros123', resave: true, saveUninitialized: true }));

const books = {
  "123": { title: "Node.js Básico", author: "João Silva", reviews: {} },
  "456": { title: "Express para Iniciantes", author: "Maria Oliveira", reviews: {} },
  "789": { title: "Dominando JavaScript", author: "João Silva", reviews: {} },
};

const users = {};

// Middleware para autenticação com JWT
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'Token necessário' });

  jwt.verify(token, 'chave_secreta', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// Tarefa 1
app.get('/books', (req, res) => {
  res.json(books);
});

// Tarefa 2
app.get('/books/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.json(book);
  res.status(404).json({ message: 'Livro não encontrado' });
});

// Tarefa 3
app.get('/books/author/:author', (req, res) => {
  const result = Object.values(books).filter(b => b.author === req.params.author);
  res.json(result);
});

// Tarefa 4
app.get('/books/title/:title', (req, res) => {
  const result = Object.values(books).filter(b => b.title === req.params.title);
  res.json(result);
});

// Tarefa 5
app.get('/books/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (book) return res.json(book.reviews);
  res.status(404).json({ message: 'Livro não encontrado' });
});

// Tarefa 6
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users[username]) return res.status(400).json({ message: 'Usuário já existe' });
  users[username] = { password };
  res.json({ message: 'Usuário registrado com sucesso' });
});

// Tarefa 7
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).json({ message: 'Credenciais inválidas' });
  const token = jwt.sign({ username }, 'chave_secreta');
  res.json({ token });
});

// Tarefa 8
app.put('/auth/review/:isbn', authenticateToken, (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: 'Livro não encontrado' });
  book.reviews[req.user.username] = req.body.review;
  res.json({ message: 'Resenha adicionada/modificada com sucesso' });
});

// Tarefa 9
app.delete('/auth/review/:isbn', authenticateToken, (req, res) => {
  const book = books[req.params.isbn];
  if (!book || !book.reviews[req.user.username]) return res.status(404).json({ message: 'Resenha não encontrada' });
  delete book.reviews[req.user.username];
  res.json({ message: 'Resenha excluída com sucesso' });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));