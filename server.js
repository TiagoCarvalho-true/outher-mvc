const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cadastroController = require('./controller/cadastroController');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

app.post('/cadastro', cadastroController.cadastrarUsuario);

// nova rota para exibir a página com a tabela
app.get('/usuarios', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'usuarios.html'));
});

// nova rota API que retorna JSON com os dados
app.get('/api/usuarios', cadastroController.getUsuariosAPI);

app.listen(3000, () => {
  console.log('🔥 Servidor rodando em http://localhost:3000');
});
