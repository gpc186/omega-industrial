const CartItem = require('../models/CartItem');

async function add(req, res) {
    const userId = req.user.id
    const { productId, quantity } = req.body;
    if (!productId) return res.status(400).json({message: "ID do produto é obrigatória!"});

    try {
        const result = await CartItem.add(userId, productId, Number(quantity) || 1);
        
        return res.json({result})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor!"});
    }
};

async function list(req, res) {
    try {
        const userId = req.user.id;
        const cart = await CartItem.findByUser(userId);

        return res.status(200).json({cart})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor!"});
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const { quantity } = req.body;

        await CartItem.updateQuantity(id, quantity);

        return res.json({message: "update com sucesso!"})

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor!"});
    }
}

async function remove(req, res) {
    try {
        const { id } = req.params;
        const ok = await CartItem.remove(id);

        if(!ok) return res.status(404).json({message: "Produto não encontrado!"});

        return res.json({ok})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor!"});
    }
}

const total = await CartItem.getTotal(req.user.id);
const count = await CartItem.count(req.user.id);

module.exports = { add, list, update, remove, total, count }