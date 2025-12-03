const { query, pool } = require('../config/database');

class Order {
  // Criar pedido
  static async create(user_id, order_numero, total_preco, items, notes = null, frete) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // Inserir pedido
      const [orderResult] = await connection.execute(
        `INSERT INTO compra (user_id, order_numero, total_preco, notes, status, frete)
         VALUES (?, ?, ?, ?, 'pending')`,
        [user_id, order_numero, total_preco, notes, frete]
      );

      const compra_id = orderResult.insertId;

      // Inserir itens do pedido
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (compra_id, product_id, quantidade, preco_unidade)
           VALUES (?, ?, ?, ?)`,
          [compra_id, item.product_id, item.quantidade, item.preco_unidade]
        );

        // Atualizar estoque - COM VERIFICAÇÃO ATÔMICA
        const [updateResult] = await connection.execute(
          'UPDATE produto SET quantidade = quantidade - ? WHERE id = ? AND quantidade >= ?',
          [item.quantidade, item.product_id, item.quantidade]
        );

        // Verificar se o estoque foi atualizado
        if (updateResult.affectedRows === 0) {
          throw new Error(`Estoque insuficiente para o produto ID ${item.product_id}`);
        }
      }

      // Limpar carrinho
      await connection.execute('DELETE FROM cart_items WHERE user_id = ?', [user_id]);

      await connection.commit();
      return compra_id;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Buscar pedido por ID
  static async findById(id) {
    const sql = `
      SELECT 
        c.*,
        u.nome as usuario_nome,
        u.CNPJ as usuario_cnpj
      FROM compra c
      JOIN user u ON c.user_id = u.id
      WHERE c.id = ?
    `;
    const results = await query(sql, [id]);
    
    if (results[0]) {
      const items = await this.getItems(id);
      results[0].items = items;
    }
    
    return results[0];
  }

  // Buscar pedidos do usuário
  static async findByUser(user_id) {
    const sql = `
      SELECT * FROM compra
      WHERE user_id = ?
      ORDER BY data_compra DESC
    `;
    return await query(sql, [user_id]);
  }

  // Listar todos os pedidos
  static async findAll() {
    const sql = `
      SELECT 
        c.*,
        u.nome as usuario_nome,
        u.CNPJ as usuario_cnpj
      FROM compra c
      JOIN user u ON c.user_id = u.id
      ORDER BY c.data_compra DESC
    `;
    return await query(sql);
  }

  // Buscar itens do pedido
  static async getItems(compra_id) {
    const sql = `
      SELECT 
        oi.*,
        p.nome as produto_nome,
        p.image_urls,
        (oi.quantidade * oi.preco_unidade) as subtotal
      FROM order_items oi
      JOIN produto p ON oi.product_id = p.id
      WHERE oi.compra_id = ?
    `;
    return await query(sql, [compra_id]);
  }

  // Atualizar status
  static async updateStatus(id, status) {
    const sql = 'UPDATE compra SET status = ? WHERE id = ?';
    await query(sql, [status, id]);
    return this.findById(id);
  }

  // Buscar por número do pedido
  static async findByOrderNumber(order_numero) {
    const sql = 'SELECT * FROM compra WHERE order_numero = ?';
    const results = await query(sql, [order_numero]);
    return results[0];
  }

  // Estatísticas de vendas
  static async getSalesStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_pedidos,
        SUM(total_preco) as total_vendas,
        AVG(total_preco) as ticket_medio,
        status
      FROM compra
      GROUP BY status
    `;
    return await query(sql);
  }

  // Gerar número único de pedido
  static generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `OP-${timestamp}-${random}`;
  }
}

module.exports = Order;