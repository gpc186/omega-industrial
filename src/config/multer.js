const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'product-' + unique + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("Tipo de imagem não permitido!"), false)
    };
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

const uploadProductImages = (req, res, next) => {

    const uploadHandler = upload.array("images", 2);

    uploadHandler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'Imagem muito grande! Tamanho máximo: 5MB'
                });
            }
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                return res.status(400).json({
                    error: 'Máximo de 2 imagens permitidas!'
                });
            }
            return res.status(400).json({ error: err.message });
        }
        // Erros customizados (fileFilter)
        else if (err) {
            return res.status(400).json({ error: err.message });
        }

        // Validar se enviou exatamente 2 imagens
        if (!req.files || req.files.length !== 2) {
            // Deletar arquivos enviados se não forem exatamente 2
            if (req.files) {
                req.files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
            }
            return res.status(400).json({
                error: 'É obrigatório enviar exatamente 2 imagens!'
            });
        };

        next()
    });
};

module.exports = { uploadProductImages };