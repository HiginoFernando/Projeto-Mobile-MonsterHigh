const db = require('../models/db');

exports.getItens = (req, res) => {
  db.all('SELECT * FROM colecionaveis', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.createItem = (req, res) => {
  const { nome, categoria, imagem, descricao } = req.body;
  db.run(
    `INSERT INTO colecionaveis (nome, categoria, imagem, descricao) VALUES (?, ?, ?, ?)`,
    [nome, categoria, imagem, descricao],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
};

exports.updateItem = (req, res) => {
  const { id } = req.params;
  const { nome, categoria, imagem, descricao } = req.body;
  db.run(
    `UPDATE colecionaveis SET nome=?, categoria=?, imagem=?, descricao=? WHERE id=?`,
    [nome, categoria, imagem, descricao, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ updated: this.changes });
    }
  );
};

exports.deleteItem = (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM colecionaveis WHERE id=?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
};
