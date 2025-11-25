const Category = require("../models/Category");

async function listarTodos(req, res) {
    try {
        const categorias = await Category.findAll();

        return res.status(200).json({ ok: true, categorias })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function listarPorId(req, res) {
    try {
        const { id } = req.params;
        const categoria = await Category.findById(id)
        if (!categoria) return res.status(404).json({ message: "Categoria não encontrada!" });

        return res.status(200).json({ ok: true, categoria })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function listarPorCategoria(req, res) {
    try {
        const { id } = req.params;

        const produtos = await Category.getProducts(id);
        if (produtos.length === 0) return res.status(404).json({ message: "Não há produtos nessa categoria!" });

        return res.status(200).json({ ok: true, produtos });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function create(req, res) {
    const { nome, description } = req.body;

    if (!nome || !description) return res.status(400).json({ message: "Todos os campos são obrigatórios!" });

    try {
        const categoryId = await Category.create({ nome, description });

        const categoria = await Category.findById(categoryId);

        res.status(200).json({ ok: true, categoria });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function update(req, res) {
    try {
        const { id } = req.params
        const { nome, description } = req.body;

        const categoria = await Category.findById(id);
        if (!categoria) return res.status(404).json({ message: "Categoria não encontrada!" });

        const categoriaNova = await Category.update(id, { nome, description });

        return res.status(200).json({ ok: true, categoriaNova })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

async function remove(req, res) {
    const { id } = req.params;

    try {
        const existe = await Category.findById(id);
        if (!existe) return res.status(404).json({ message: "Categoria não encontrada!" });

        await Category.delete(id)

        return res.status(200).json({ ok: true, message: "Categoria removida com sucesso!" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
}

module.exports = { listarTodos, listarPorId, listarPorCategoria, create, update, remove }