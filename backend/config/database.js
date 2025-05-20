const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./colecionaveis.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS colecionaveis (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      categoria TEXT,
      imagem TEXT,
      descricao TEXT
    )
  `);
});

module.exports = db;
