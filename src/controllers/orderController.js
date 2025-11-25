const Order = require('../models/Order');
const CartItem = require('../models/CartItem');

async function createOrder(req, res) {
    try {
        const userId = req.user.id;

        const cartItems = await CartItem.findByUser(userId);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: "O carrinho está vazio!" });
        };

        const items = cartItems.map(item => ({
            product_id: item.product_id,
            quantidade: item.quantidade,
            preco_unidade: item.preco
        }));

        const total_preco = items.reduce((total, item) => {
            return total + (item.quantidade * item.preco_unidade);
        }, 0);

        const order_numero = Order.generateOrderNumber();

        const compra_id = await Order.create(userId, order_numero, total_preco, items, req.body.notes || null);

        return res.status(201).json({ ok: true, message: "Pedido criado com sucesso!", compra_id, order_numero, total_preco });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function getOrderById(req, res) {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) return res.status(404).json({ message: "Ordem não encontrada!" });

        if (order.user_id !== req.user.id && req.user.role !== "adm") return res.status(403).json({ message: "Você não pode acessar!" });

        return res.status(200).json({ ok: true, order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function getMyOrders(req, res) {
    try {
        const userId = req.user.id;

        const pedidos = await Order.findByUser(userId);

        if (pedidos.length === 0) return res.status(404).json({ message: "Nenhum pedido ainda foi feito" });

        return res.status(200).json({ ok: true, pedidos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function listAllOrders(req, res) {
    try {
        const pedidos = await Order.findAll();

        return res.status(200).json({ ok: true, pedidos })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function updateOrderstatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const existe = await Order.findById(id);
        if (!existe) return res.status(404).json({ message: "Ordem não encontrada!" });

        const pedidoAtualizado = await Order.updateStatus(id, status);

        return res.status(200).json({ ok: true, pedidoAtualizado })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

module.exports = { createOrder, getOrderById, getMyOrders, listAllOrders, updateOrderstatus }