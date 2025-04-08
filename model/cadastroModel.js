const fs = require('fs');
const path = require('path');

exports.salvarNome = (nome) => {
  const filePath = path.join(__dirname, '..', 'dados.txt');
  fs.appendFileSync(filePath, nome + '\n');
};
