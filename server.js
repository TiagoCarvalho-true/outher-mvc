const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const cadastroController = require('./controller/cadastroController');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.post('/cadastro', cadastroController.cadastrarUsuario);

// NOVA ROTA:
app.get('/usuarios', cadastroController.listarUsuarios);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
