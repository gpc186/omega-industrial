const CartItem = require('../models/CartItem');

async function add(req, res) {
    const userId = req.user.id
    const { productId, quantity } = req.body;
    const quantidade = Number(quantity) > 0 ? Number(quantity) : 1;
    if (!productId) return res.status(400).json({ ok: false, error: "ID do produto é obrigatória!" });

    try {
        const result = await CartItem.add(userId, productId, quantidade);

        return res.json({ ok: true, message: "Produto adicionado com sucesso!", result })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" });
    }
};

async function list(req, res) {
    try {
        const userId = req.user.id;
        const cart = await CartItem.findByUser(userId);

        return res.status(200).json({ ok: true, message: "Listagem do carrinho completa!", cart })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" });
    }
}

async function update(req, res) {
    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const { quantity } = req.body;

        await CartItem.updateQuantity(userId, productId, quantity);

        return res.json({ ok: true, message: "update com sucesso!" })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" });
    }
}

async function remove(req, res) {
    try {

        const remover = await CartItem.remove(req.user.id, req.params.id);

        if (!remover) return res.status(404).json({ ok: false, error: "Produto não encontrado!" });

        return res.json({ ok: true, message: "Removido com sucesso!", remover })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor!" });
    }
}

async function total(req, res) {
    const total = await CartItem.getTotal(req.user.id);
    res.json({ ok: true, message: "Total com sucesso!", total });
}

async function count(req, res) {
    const count = await CartItem.count(req.user.id);
    res.json({ ok: true, message: "Contado com sucesso!", count });
}

module.exports = { add, list, update, remove, total, count }