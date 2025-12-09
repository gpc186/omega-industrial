const Product = require("../models/Product");
const { deleteUploadedFiles, deleteProductImage, getImageUrls } = require("../utils/fileHelper");

// LISTAR TODOS
async function listarTodos(req, res) {
    try {
        const produtos = await Product.findAll();
        return res.status(200).json({
            ok: true,
            message: "Todos os produtos foram listados com sucesso!",
            produtos
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" });
    }
}

// LISTAR POR ID
async function listarPorId(req, res) {
    try {
        const { id } = req.params;
        const produto = await Product.findById(id);

        if (!produto) {
            return res.status(404).json({ ok: false, error: "Produto não encontrado!" });
        }
        console.log(produto);

        return res.status(200).json({
            ok: true,
            message: "Produto listado por ID com sucesso!",
            produto
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" });
    }
}

// CRIAR PRODUTO
async function create(req, res) {
    const { nome, preco, descricao, category_id, quantidade } = req.body;

    if (!nome || !preco || !category_id || !quantidade) {
        deleteUploadedFiles(req.files);
        return res.status(400).json({
            ok: false,
            error: "Nome, preço, categoria e quantidade são obrigatórios."
        });
    }

    if (!req.files || req.files.length !== 2) {
        deleteUploadedFiles(req.files);
        return res.status(400).json({
            ok: false,
            error: "É obrigatório enviar exatamente 2 imagens!"
        });
    }

    try {
        const image_urls = getImageUrls(req.files);

        const produto = await Product.create({
            nome,
            preco,
            descricao,
            image_urls,
            category_id,
            quantidade
        });

        return res.status(201).json({
            ok: true,
            message: "Produto criado com sucesso!",
            produto
        });
    } catch (error) {
        deleteUploadedFiles(req.files);
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" });
    }
}

// ATUALIZAR PRODUTO
async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, preco, descricao, category_id, quantidade } = req.body;

        const produto = await Product.findById(id);

        if (!produto) {
            deleteUploadedFiles(req.files)
            return res.status(404).json({ ok: false, error: "Produto não encontrado!" });
        }

        let image_urls = produto.image_urls || [];

        if (req.files && req.files.length === 2) {
            deleteProductImage(produto.image_urls);
            image_urls = getImageUrls(req.files);
        }

        await Product.update(id, {
            nome: nome ?? produto.nome,
            preco: preco ?? produto.preco,
            descricao: descricao ?? produto.descricao,
            image_urls,
            category_id: category_id ?? produto.category_id,
            quantidade: quantidade ?? produto.quantidade
        });

        return res.status(200).json({
            ok: true,
            message: "Produto atualizado com sucesso!"
        });
    } catch (error) {
        deleteUploadedFiles(req.files);
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" });
    }
}

// DELETAR PRODUTO
async function remove(req, res) {
    try {
        const { id } = req.params;

        const produto = await Product.findById(id);
        if (!produto) {
            return res.status(404).json({ ok: false, error: "Produto não encontrado!" });
        }

        if (produto.image_urls) {
            deleteProductImage(produto.image_urls);
        }

        const removed = await Product.delete(id);

        if (!removed) {
            return res.status(500).json({ ok: false, error: "Erro ao remover produto." });
        }

        return res.status(200).json({
            ok: true,
            message: "Produto deletado com sucesso!"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: "Erro interno do servidor"
        });
    }
}

module.exports = {
    listarTodos,
    listarPorId,
    create,
    update,
    remove
};
