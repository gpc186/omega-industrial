const { query } = require('../config/database');

class Product {
  // Criar produto
  static async create({ nome, preco, descricao, img_url, category_id, quantidade = 0 }) {
    const sql = `
      INSERT INTO produto (nome, preco, descricao, img_url, category_id, quantidade)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [nome, preco, descricao, img_url, category_id, quantidade]);
    return result.insertId;
  }

  // Buscar por ID
  static async findById(id) {
    const sql = `
      SELECT p.*, c.nome as categoria_nome 
      FROM produto p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `;
    const results = await query(sql, [id]);
    return results[0];
  }

  // Listar todos
  static async findAll() {
    const sql = `
      SELECT p.*, c.nome as categoria_nome 
      FROM produto p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    return await query(sql);
  }

  // Buscar por categoria
  static async findByCategory(category_id) {
    const sql = 'SELECT * FROM produto WHERE category_id = ?';
    return await query(sql, [category_id]);
  }

  // Buscar por nome (pesquisa)
  static async search(searchTerm) {
    const sql = `
      SELECT p.*, c.nome as categoria_nome 
      FROM produto p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.nome LIKE ? OR p.descricao LIKE ?
    `;
    const term = `%${searchTerm}%`;
    return await query(sql, [term, term]);
  }

  // Atualizar produto
  static async update(id, { nome, preco, descricao, img_url, category_id, quantidade }) {
    const sql = `
      UPDATE produto 
      SET nome = ?, preco = ?, descricao = ?, img_url = ?, category_id = ?, quantidade = ?
      WHERE id = ?
    `;
    
    await query(sql, [nome, preco, descricao, img_url, category_id, quantidade, id]);
    return this.findById(id);
  }

  // Atualizar estoque
  static async updateStock(id, quantidade) {
    const sql = 'UPDATE produto SET quantidade = quantidade + ? WHERE id = ?';
    await query(sql, [quantidade, id]);
    return this.findById(id);
  }

  // Deletar produto
  static async delete(id) {
    const sql = 'DELETE FROM produto WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Verificar disponibilidade
  static async checkAvailability(id, quantidadeDesejada) {
    const produto = await this.findById(id);
    return produto && produto.quantidade >= quantidadeDesejada;
  }
}

module.exports = Product;