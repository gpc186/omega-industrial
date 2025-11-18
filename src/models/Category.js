const { query } = require('../config/database');

class Category {
  // Criar categoria
  static async create({ nome, description }) {
    const sql = 'INSERT INTO categories (nome, description) VALUES (?, ?)';
    const result = await query(sql, [nome, description]);
    return result.insertId;
  }

  // Buscar por ID
  static async findById(id) {
    const sql = 'SELECT * FROM categories WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0];
  }

  // Listar todas
  static async findAll() {
    const sql = 'SELECT * FROM categories';
    return await query(sql);
  }

  // Atualizar categoria
  static async update(id, { nome, description }) {
    const sql = 'UPDATE categories SET nome = ?, description = ? WHERE id = ?';
    await query(sql, [nome, description, id]);
    return this.findById(id);
  }

  // Deletar categoria
  static async delete(id) {
    const sql = 'DELETE FROM categories WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Buscar produtos de uma categoria
  static async getProducts(id) {
    const sql = 'SELECT * FROM produto WHERE category_id = ?';
    return await query(sql, [id]);
  }
}

module.exports = Category;
