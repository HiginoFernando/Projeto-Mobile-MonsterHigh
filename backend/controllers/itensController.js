
const db = require('../config/database');


exports.getItens = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM colecionaveis');
    res.json(rows);
  } catch (err) {
    console.error('Erro ao buscar itens:', err);
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
};


exports.createItem = async (req, res) => {
  const { nome, categoria, imagem, descricao, comprado } = req.body;
  try {
    const [result] = await db.execute(
      `INSERT INTO colecionaveis
         (nome, categoria, imagem, descricao, comprado)
       VALUES (?, ?, ?, ?, ?)`,
      [nome, categoria, imagem, descricao, comprado ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('Erro ao inserir item:', err);
    res.status(500).json({ error: 'Erro ao inserir item' });
  }
};


exports.updateItem = async (req, res) => {
  const { id } = req.params;
  const { nome, categoria, imagem, descricao, comprado } = req.body;
  try {
    const [result] = await db.execute(
      `UPDATE colecionaveis
         SET nome=?, categoria=?, imagem=?, descricao=?, comprado=?
       WHERE id=?`,
      [nome, categoria, imagem, descricao, comprado ? 1 : 0, id]
    );
    res.json({ updated: result.affectedRows });
  } catch (err) {
    console.error('Erro ao atualizar item:', err);
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};


exports.deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM colecionaveis WHERE id = ?', [id]);
    res.json({ deleted: result.affectedRows });
  } catch (err) {
    console.error('Erro ao remover item:', err);
    res.status(500).json({ error: 'Erro ao remover item' });
  }
};