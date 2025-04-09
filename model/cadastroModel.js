const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'usuarios.json');

function lerUsuarios() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
  }

  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

function salvarUsuario(usuario) {
  const usuarios = lerUsuarios();
  usuarios.push(usuario);

  fs.writeFileSync(filePath, JSON.stringify(usuarios, null, 2));
}

module.exports = { salvarUsuario };
