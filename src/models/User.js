const { query } = require('../config/database');
const bcrypt = require('bcrypt');

class User {
  static async create({email, nome, CNPJ, password, phone, role = 'user' }) {
    const password_hash = await bcrypt.hash(password, 10);
    
    const sql = `
      INSERT INTO user (email, nome, CNPJ, password_hash, phone, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [email, nome, CNPJ, password_hash, phone, role]);
    return result.insertId;
  }
  //Buscar por ID
    static async findById(id){
    const sql = 'SELECT * FROM user WHERE id = ?';
    const results = await query(sql, [id]);
    return results[0];
    }

    //Buscar por CNPJ
    static async findByCNPJ(CNPJ){
        const sql = 'SELECT * FROM user WHERE CNPJ = ?'
        const results = await query (sql, [CNPJ])
        return results[0];
    }

    //Buscar por email
    static async findByEmail (email){
        const sql = 'SELECT * FROM user WHERE email = ?'
        const results = await query (sql, [email])
        return results[0];
    }

    //listar todos
    static async findAll(){
        const sql = 'SELECT * FROM user'
        const results = await query (sql)
        return results;
    }
     // Atualizar usuário
  static async update(id, { nome, phone, role }) {
    const sql = `
      UPDATE user 
      SET nome = ?, phone = ?, role = ?
      WHERE id = ?
    `;
    
    await query(sql, [nome, phone, role, id]);
    return this.findById(id);
  }

  // Atualizar senha
  static async updatePassword(id, newPassword) {
    const password_hash = await bcrypt.hash(newPassword, 10);
    const sql = 'UPDATE user SET password_hash = ? WHERE id = ?';
    await query(sql, [password_hash, id]);
  }

  // Deletar usuário
  static async delete(id) {
    const sql = 'DELETE FROM user WHERE id = ?';
    const result = await query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Verificar senha
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

}
    module.exports = User;
