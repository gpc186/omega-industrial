const { query } = require('../config/database');

class Product {

  // Criar produto
  static async create({ nome, preco, descricao, image_urls, category_id, quantidade = 0 }) {
    const sql = `
      INSERT INTO produto (nome, preco, descricao, image_urls, category_id, quantidade)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const imageUrlsJson = JSON.stringify(image_urls);

    const result = await query(sql, [
      nome,
      preco,
      descricao,
      imageUrlsJson,
      category_id,
      quantidade
    ]);

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

    if (!results[0]) return null;

    // Converte JSON -> array
    if (results[0].image_urls) {
      results[0].image_urls = JSON.parse(results[0].image_urls);
    }

    return results[0];
  }

  // Listar todos
  static async findAll() {
    const sql = `
      SELECT p.*, c.nome as categoria_nome 
      FROM produto p
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const results = await query(sql);

    return results.map(produto => {
      if (produto.image_urls) {
        produto.image_urls = JSON.parse(produto.image_urls);
      }
      return produto;
    });
  }

  // Buscar por categoria
  static async findByCategory(category_id) {
    const sql = 'SELECT * FROM produto WHERE category_id = ?';
    return await query(sql, [category_id]);
  }

  // Buscar por nome
  static async search(searchTerm) {
    const sql = `
      SELECT p.*, c.nome as categoria_nome 
      FROM produto p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.nome LIKE ? OR p.descricao LIKE ?
    `;
    const term = `%${searchTerm}%`;

    const results = await query(sql, [term, term]);

    return results.map(produto => {
      if (produto.image_urls) {
        produto.image_urls = JSON.parse(produto.image_urls);
      }
      return produto;
    });
  }

  // Atualizar produto
  static async update(id, { nome, preco, descricao, image_urls, category_id, quantidade }) {
    const sql = `
      UPDATE produto 
      SET nome = ?, preco = ?, descricao = ?, image_urls = ?, category_id = ?, quantidade = ?
      WHERE id = ?
    `;

    const imageUrlsJson = image_urls ? JSON.stringify(image_urls) : null;

    await query(sql, [
      nome,
      preco,
      descricao,
      imageUrlsJson,
      category_id,
      quantidade,
      id
    ]);

    return this.findById(id);
  }

  // Atualizar estoque
  static async updateStock(id, quantidade) {
    const sql = 'UPDATE produto SET quantidade = quantidade + ? WHERE id = ?';
    await query(sql, [quantidade, id]);
    return this.findById(id);
  }

  // Deletar
  static async delete(id) {
    const sql = 'DELETE FROM produto WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Disponibilidade
  static async checkAvailability(id, quantidadeDesejada) {
    const produto = await this.findById(id);
    return produto && produto.quantidade >= quantidadeDesejada;
  }
}

module.exports = Product;
