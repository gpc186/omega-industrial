const fs = require('fs');
const path = require('path');

function deleteFiles(filePath) {
    try {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
        };
    } catch (error) {
        console.error("Erro ao deletar o arquivo", error);
    };
};

function deleteUploadedFiles(files) {
    if (!files || files.length === 0) return;

    files.forEach(f => {
        try {
            fs.unlinkSync(f.path)
        } catch (error) {
            console.error("Erro ao deletar o arquivo", error);
        }
    });
};

function deleteProductImage(img_urls) {
    if(!img_urls || !Array.isArray(img_urls)) return;

    img_urls.forEach(url =>{
        const filePath = path.join(__dirname, '../../', url);
        deleteFiles(filePath);
    });
};

function getImageUrls(files) {
    if (!files || files.length === 0) return [];
    return files.map(f => `/uploads/products/${f.filename}`);
};

module.exports = { deleteFiles, deleteProductImage, deleteUploadedFiles, getImageUrls }