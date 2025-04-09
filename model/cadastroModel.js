const fs = require('fs').promises;
const path = require('path');

const filePath = path.join(__dirname, '../data/usuarios.json'); // agora vai salvar em uma pasta correta!

// Garante que o arquivo exista
async function garantirArquivo() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]');
  }
}

async function salvarUsuario(usuario) {
  await garantirArquivo();
  const data = await fs.readFile(filePath, 'utf-8');
  const usuarios = JSON.parse(data);
  usuarios.push(usuario);
  await fs.writeFile(filePath, JSON.stringify(usuarios, null, 2));
}

async function getUsuarios() {
  await garantirArquivo();
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

module.exports = {
  salvarUsuario,
  getUsuarios
};
