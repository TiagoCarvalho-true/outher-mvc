const { salvarNome } = require('../model/cadastroModel');

exports.cadastrarUsuario = (req, res) => {
  const nome = req.body.nome;

  if (!nome) {
    return res.send('Nome é obrigatório!');
  }

  salvarNome(nome);
  res.send(`<h2>Cadastro de "${nome}" realizado com sucesso!</h2><a href="/">Voltar</a>`);
};
