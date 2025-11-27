const { generateToken } = require('../utils/generateToken')
const User = require('../models/User');

async function registrar(req, res) {

    try {
        const { nome, email, CNPJ, phone, password } = req.body;

        if (!nome || !email || !CNPJ || !phone || !password) {
            return res.status(400).json({ error: "Preencha todos os campos!" });
        }

        const existingEmail = await User.findByEmail(email)
        if (existingEmail) {
            return res.status(409).json({ error: "Email já cadastrado!" })
        }

        const id = await User.create({ email, nome, CNPJ, password, phone });
        const token = generateToken(id, "user");

        return res.status(201).json({
            ok: true,
            message: "Registro feito com sucesso!",
            token,
            user: {
                id,
                nome,
                email,
                CNPJ,
                role: "user"
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" })
    }
}

async function login(req, res) {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ ok: false, error: "Os dois campos são necessários!" });
        };

        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ ok: false, error: "Credenciais inválidas!" });
        };

        const senhacorreta = await User.verifyPassword(password, user.password_hash)
        if (!senhacorreta) {
            return res.status(401).json({ ok: false, error: "Credenciais inválidas!" })
        };

        const token = generateToken(user.id, user.role);

        return res.status(200).json({
            ok: true,
            message: "Login efetuado com sucesso!",
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                CNPJ: user.CNPJ,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" })
    }

}

async function me(req, res) {
    try {
        const userId = req.user.id;
    
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ ok: false, error: "Usuário não encontrado!" })
        }
    
        return res.status(200).json({
            ok: true,
            message: "Dados carregados com sucesso!",
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                CNPJ: user.CNPJ,
                phone: user.phone,
                role: user.role
            }
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" })
    }
}

module.exports = { registrar, login, me }