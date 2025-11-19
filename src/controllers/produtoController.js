const Product = require("../models/Product");

async function listarTodos(req, res) {
    try {
        const produtos = await Product.findAll()
    
        return res.status(200).json({ok: true, produtos})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor"})
    }
}

async function listarPorId(req, res) {
    try {
        const { id } = req.params;

        const produto = await Product.findById(id);

        if(!produto){
            return res.status(404).json({message: "Produto não encontrado!"})
        }

        return res.status(200).json({ok: true, produto})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor"})
    }
}

async function create(req, res) {
    const { nome, preco, descricao, img_url, category_id, quantidade } = req.body;

        if (!nome || !preco || !img_url || !category_id ) {
            return res.status(400).json({ message: "Nome, preço e categoria são obrigatórios." });
        };
    
    try {
        
        const produtoId = await Product.create({
            nome, preco, descricao, img_url, category_id, quantidade
        });

        return res.status(200).json({ok: true, id: produtoId})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor"})
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const dados = req.body;

        const existe = await Product.findById(id);
        if(!existe) return res.status(404).json({message: "Produto não encontrado!"});
        
        await Product.update(id, {dados});
        return res.status(200).json({ok: true});

    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor"})
    }
};

async function remove(req, res) {
    try {
        const { id } = req.params;

        const existe = await Product.findById(id);
        if(!existe) return res.status(404).json({message: "Produto não encontrado!"});

        await Product.delete(id);
        res.status(200).json({ok: true})
    } catch (error) {
        console.error(error);
        return res.status(500).json({message: "Erro interno do servidor"})
    }
}

module.exports = { listarTodos };