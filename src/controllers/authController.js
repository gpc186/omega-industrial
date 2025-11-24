const { generateToken } = require('../utils/generateToken')
const { findByEmail, create, verifyPassword, findById } = require('../models/User');

async function registrar(req, res) {

    try {
        const { nome, email, CNPJ, phone, password } = req.body;

        if (!nome || !email || !CNPJ || !phone || !password) {
            return res.status(400).json({ message: "Preencha todos os campos!" });
        }

        const existingEmail = await findByEmail(email)
        if (existingEmail) {
            return res.status(409).json({ mensagem: "Email já cadastrado!" })
        }

        const id = await create({email, nome, CNPJ, password, phone});
        const token = generateToken(id, "user");

        return res.status(201).json({
            ok: true,
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
        return res.status(500).json({ message: "Erro interno do servidor!" })
    }
}

async function login(req, res) {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Os dois campos são necessários!" });
        };

        const user = await findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas!" });
        };

        const senhacorreta = await verifyPassword(password, user.password_hash)
        if (!senhacorreta) {
            return res.status(401).json({ mensagem: "Credenciais inválidas!" })
        };

        const token = generateToken(user.id, user.role);

        return res.status(200).json({
            ok: true,
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
        return res.status(500).json({ message: "Erro interno do servidor!" })
    }

}

async function me(req, res) {
    const userId = req.user.id;

    const user = await findById(userId);
    if(!user){
        return res.status(404).json({message: "Usuário não encontrado!"})
    }

    return res.status(200).json({ok: true,
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            CNPJ: user.CNPJ,
            phone: user.phone,
            role: user.role
        }
    })
}

module.exports = { registrar, login, me }