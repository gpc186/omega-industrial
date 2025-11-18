const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/generateToken')
const { pool } = require('../config/database');

async function registrar(req, res) {
    const { nome, email, CNPJ, phone, password } = req.body;

    if (!nome || !email || !CNPJ || !phone || !password) {
        return res.json({ message: "Preencha todos os campos!" });
    }

    const [existingEmail] = await pool.query("SELECT id FROM user WHERE email=?", [email]);
    if (existingEmail.length > 0) {
        return res.json({ mensagem: "Email já cadastrado!" })
    }

    const password_hash = await bcrypt.hash(password, 10);

    const [result] = await pool.query("INSERT INTO user (nome, CNPJ, password_hash, email, phone) VALUES (?, ?, ?, ?, ?)", [nome, CNPJ, password_hash, email, phone]);
    const token = generateToken(result.insertId, "user");

    return res.status(201).json({
        ok: true,
        token,
        user: {
            id: result.insertId,
            nome,
            email,
            CNPJ,
            role: "user"
        }
    })
}

async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ message: "Os dois campos são necessários!" });
    };

    const [user] = await pool.query("SELECT * FROM user WHERE email = ?");
    if (user.length === 0) {
        return res.json({ message: "Usário não encontrado!" });
    };

    const senhacorreta = await bcrypt.compare(password, user[0].password_hash);
    if (!senhacorreta) {
        return res.json({ mensagem: "Usuário ou senha inválidos!" })
    };

    const token = generateToken(user[0].id, user[0].role);

    return res.status(200).json({
        ok: true,
        token,
        user: {
            id: user[0].id,
            nome: user[0].nome,
            email: user[0].email,
            CNPJ: user[0].CNPJ,
            role: user[0].role
        }
    });

}

module.exports = { registrar, login }