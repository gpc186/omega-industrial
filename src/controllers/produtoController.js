const Product = require("../models/Product");
const fs = require('fs');
const path = require('path');

async function listarTodos(req, res) {
    try {
        const produtos = await Product.findAll()

        return res.status(200).json({ ok: true, message: "Todos os produtos foram listados com sucesso!", produtos })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" })
    }
}

async function listarPorId(req, res) {
    try {
        const { id } = req.params;

        const produto = await Product.findById(id);

        if (!produto) {
            return res.status(404).json({ ok: false, error: "Produto não encontrado!" })
        }

        return res.status(200).json({ ok: true, message: "Produto foi listado por id com sucesso!", produto })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" })
    }
}

async function create(req, res) {
    const { nome, preco, descricao, category_id, quantidade } = req.body;

    if (!nome || !preco || !category_id || !quantidade) {
        if (req.files) {
            req.files.forEach(file => fs.unlinkSync(file.path));
        }
        return res.status(400).json({ ok: false, error: "Nome, preço e categoria são obrigatórios." });
    };

    if (!req.files || req.files.length !== 2) {
        return res.status(400).json({
            ok: false,
            error: "É obrigatório enviar exatamente 2 imagens!"
        });
    }

    try {

        const img_urls = req.files.map(f => `/uploads/products/${f.filename}`);

        const produtoId = await Product.create({
            nome, preco, descricao, img_urls, category_id, quantidade: quantidade || 0
        });

        return res.status(200).json({ ok: true, message: "Produto foi criado com sucesso!", id: produtoId })
    } catch (error) {

        if (req.files) {
            req.files.forEach(f => {
                try {
                    fs.unlinkSync(f.path);
                } catch (err) {
                    console.error('Erro ao deletar arquivo:', err);
                }
            });
        }
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" })
    }
}

async function update(req, res) {
    try {
        const { id } = req.params;
        const { nome, preco, descricao, category_id, quantidade } = req.body;

        const existe = await Product.findById(id);
        
        if (!existe) {
            
            if (req.files) {
                req.files.forEach(file => fs.unlinkSync(file.path));
            }
            
            return res.status(404).json({ ok: false, error: "Produto não encontrado!" });
        }

        let img_urls = existe.img_urls;

        if(req.files && req.files === 2) {
            if(existe.img_urls && Array.isArray(existe.img_urls)) {
                existe.img_urls.forEach(url =>{
                    const filePath = path.join(__dirname, '../../', url);
                    try {
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        };
                    } catch (error) {
                       console.log(error);
                    }
                })
            }
            img_urls = req.files.map(file => `/uploads/products/${file.filename}`);
        };

        await Product.update(id, {
            nome: nome || existe.nome,
            preco: preco || existe.preco,
            descricao: descricao || existe.descricao,
            img_urls,
            category_id: category_id || existe.category_id,
            quantidade: quantidade !== undefined ? quantidade : existe.quantidade
        });
        return res.status(200).json({ ok: true, message: "Produto foi atualizado com sucesso!" });

    } catch (error) {

        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (err) {
                    console.error('Erro ao deletar arquivo:', err);
                }
            });
        }

        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" })
    }
};

async function remove(req, res) {
    try {
        const { id } = req.params;

        const existe = await Product.findById(id);
        if (!existe) return res.status(404).json({ ok: false, error: "Produto não encontrado!" });

        await Product.delete(id);

        if (existe.image_urls && Array.isArray(existe.image_urls)) {
            existe.image_urls.forEach(url => {
                const filePath = path.join(__dirname, '../../', url);
                try {
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                } catch (err) {
                    console.error('Erro ao deletar imagem:', err);
                }
            });
        };

        res.status(200).json({ ok: true, message: "Produto deletado com sucesso!" })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ ok: false, error: "Erro interno do servidor" })
    }
}

module.exports = { listarTodos, listarPorId, create, update, remove };