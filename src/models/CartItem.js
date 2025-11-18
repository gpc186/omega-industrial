const { query } = require('../config/database');

class CartItem {
  // Adicionar item ao carrinho
  static async add(user_id, product_id, quantidade = 1) {
    const sql = `
      INSERT INTO cart_items (user_id, product_id, quantidade)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE quantidade = quantidade + ?
    `;
    
    const result = await query(sql, [user_id, product_id, quantidade, quantidade]);
    return result.insertId || result.affectedRows;
  }

  // Buscar carrinho do usuário
  static async findByUser(user_id) {
    const sql = `
      SELECT 
        ci.*,
        p.nome,
        p.preco,
        p.img_url,
        p.quantidade as estoque,
        (ci.quantidade * p.preco) as subtotal
      FROM cart_items ci
      JOIN produto p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `;
    return await query(sql, [user_id]);
  }

  // Atualizar quantidade
  static async updateQuantity(user_id, product_id, quantidade) {
    const sql = `
      UPDATE cart_items 
      SET quantidade = ?
      WHERE user_id = ? AND product_id = ?
    `;
    
    await query(sql, [quantidade, user_id, product_id]);
  }

  // Remover item
  static async remove(user_id, product_id) {
    const sql = 'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?';
    const result = await query(sql, [user_id, product_id]);
    return result.affectedRows > 0;
  }

  // Limpar carrinho
  static async clear(user_id) {
    const sql = 'DELETE FROM cart_items WHERE user_id = ?';
    await query(sql, [user_id]);
  }

  // Calcular total do carrinho
  static async getTotal(user_id) {
    const sql = `
      SELECT SUM(ci.quantidade * p.preco) as total
      FROM cart_items ci
      JOIN produto p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `;
    const results = await query(sql, [user_id]);
    return results[0]?.total || 0;
  }

  // Contar itens no carrinho
  static async count(user_id) {
    const sql = 'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?';
    const results = await query(sql, [user_id]);
    return results[0]?.count || 0;
  }
}

module.exports = CartItem;