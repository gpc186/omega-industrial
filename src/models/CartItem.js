const { query } = require('../config/database');

class CartItem {
  // Adicionar item ao carrinho
  static async add(user_id, product_id, quantidade = 1) {
    // Verificar estoque disponível
    const [produto] = await query('SELECT quantidade FROM produto WHERE id = ?', [product_id]);
    
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    
    // Verificar quantidade atual no carrinho
    const [itemCarrinho] = await query(
      'SELECT quantidade FROM cart_items WHERE user_id = ? AND product_id = ?',
      [user_id, product_id]
    );
    
    const quantidadeTotal = itemCarrinho ? itemCarrinho.quantidade + quantidade : quantidade;
    
    if (produto.quantidade < quantidadeTotal) {
      throw new Error('Estoque insuficiente');
    }
    
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
        p.image_urls,
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
    // Verificar estoque disponível
    const [produto] = await query('SELECT quantidade FROM produto WHERE id = ?', [product_id]);
    
    if (!produto) {
      throw new Error('Produto não encontrado');
    }
    
    if (produto.quantidade < quantidade) {
      throw new Error('Estoque insuficiente');
    }
    
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