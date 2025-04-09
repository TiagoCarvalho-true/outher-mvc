// controller/cadastroController.js

const { salvarUsuario, getUsuarios } = require('../model/cadastroModel');
const bcrypt = require('bcrypt');

exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, idade, genero, senha } = req.body;

    let interesses = req.body.interesses || [];
    if (!Array.isArray(interesses)) interesses = [interesses];

    if (!nome || !email || isNaN(idade) || !senha) {
      return res.status(400).send('Por favor, preencha todos os campos obrigatórios corretamente.');
    }

    const hashedSenha = await bcrypt.hash(senha, 10);

    const usuario = {
      nome,
      email,
      idade: parseInt(idade),
      genero,
      interesses,
      senha: hashedSenha,
    };

    await salvarUsuario(usuario);
    res.send(`<h2>Usuário ${nome} cadastrado com sucesso!</h2><a href="/">Voltar</a>`);
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro no servidor ao cadastrar o usuário.');
  }
};

// NOVA LISTAGEM com HTML dinâmico separado
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await getUsuarios();

    let html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Lista de Usuários</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-secondary text-light">
      <div class="container mt-5">
        <h1 class="text-center mb-4">Usuários Cadastrados</h1>
        <table class="table table-dark table-hover table-bordered text-white">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Idade</th>
              <th>Gênero</th>
              <th>Interesses</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (usuarios.length === 0) {
      html += `
        <tr>
          <td colspan="5" class="text-center">Nenhum usuário cadastrado ainda.</td>
        </tr>
      `;
    } else {
      usuarios.forEach(user => {
        html += `
        <tr>
          <td>${user.nome}</td>
          <td>${user.email}</td>
          <td>${user.idade}</td>
          <td>${user.genero}</td>
          <td>${Array.isArray(user.interesses) ? user.interesses.join(', ') : 'Nenhum'}</td>
        </tr>`;
      });
    }

    html += `
          </tbody>
        </table>
        <div class="text-center">
          <a href="/" class="btn btn-light mt-3">Voltar ao Cadastro</a>
        </div>
      </div>
    </body>
    </html>`;

    res.send(html);
  } catch (err) {
    console.error('Erro ao listar usuários:', err);
    res.status(500).send('Erro no servidor ao listar usuários.');
  }
};
// nova função no cadastroController.js
exports.getUsuariosAPI = async (req, res) => {
  try {
    const usuarios = await getUsuarios();
    res.json(usuarios);
  } catch (err) {
    console.error('Erro ao carregar os usuários:', err);
    res.status(500).json({ erro: 'Erro no servidor ao carregar os usuários.' });
  }
};
