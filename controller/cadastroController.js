const fs = require('fs').promises;
const path = require('path');
const { salvarUsuario } = require('../model/cadastroModel');
const bcrypt = require('bcrypt'); // Adicionado para segurança das senhas

// Função para cadastrar um usuário
exports.cadastrarUsuario = async (req, res) => {
  try {
    const { nome, email, idade, genero, senha } = req.body;

    let interesses = req.body.interesses || [];
    if (!Array.isArray(interesses)) {
      interesses = [interesses];
    }

    if (!nome || !email || isNaN(idade) || !senha) {
      return res.status(400).send('Por favor, preencha todos os campos obrigatórios corretamente.');
    }

    const hashedSenha = await bcrypt.hash(senha, 10); // Criptografa a senha

    const usuario = {
      nome,
      email,
      idade: parseInt(idade),
      genero,
      interesses,
      senha: hashedSenha,
    };

    salvarUsuario(usuario);
    res.send(`<h2>Usuário ${nome} cadastrado com sucesso!</h2><a href="/">Voltar</a>`);
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro no servidor ao cadastrar o usuário.');
  }
};

// Função para listar usuários
exports.listarUsuarios = async (req, res) => {
  const filePath = path.join(__dirname, 'usuarios.json');


  try {
    // Verifica se o arquivo existe, caso contrário, cria um vazio
    if (!fs.existsSync(filePath)) {
      await fs.writeFile(filePath, '[]');
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const usuarios = JSON.parse(data);

    let html = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <title>Usuários Cadastrados</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="bg-dark text-white">
      <div class="container mt-5">
        <h1 class="text-center mb-4">Usuários Cadastrados</h1>
        <table class="table table-dark table-hover table-bordered table-striped">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Idade</th>
              <th>Gênero</th>
              <th>Interesses</th>
              <th>Senha</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (usuarios.length === 0) {
      html += `
        <tr>
          <td colspan="6" class="text-center">Nenhum usuário cadastrado ainda.</td>
        </tr>
      `;
    } else {
      usuarios.forEach((user) => {
        const interesses = Array.isArray(user.interesses) ? user.interesses : [];
        html += `
          <tr>
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.idade}</td>
            <td>${user.genero}</td>
            <td>${interesses.join(', ') || 'Sem interesses'}</td>
            <td>${user.senha}</td>
          </tr>
        `;
      });
    }

    html += `
          </tbody>
        </table>
        <a href="/" class="btn btn-primary mt-3">Voltar ao Cadastro</a>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error('Erro ao carregar os usuários:', err);
    res.status(500).send('Erro no servidor ao carregar os usuários.');
  }
};