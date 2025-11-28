const express = require('express');
const app = express();
const authRoute = require('./routes/authRoute');
const path = require('path');
const cors = require('cors');
// const errorHandler = require('./middleware/errorHandler')
const produtoRoute = require('./routes/produtoRoute');
const categoryRoute = require('./routes/categoryRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
require('dotenv').config();

// app.use(errorHandler);

app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/product', produtoRoute);
app.use('/api/category', categoryRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);

app.use('/login', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'login.html'))
})
app.use('/resgistrar', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'criar-conta.html'))
})
app.use('/carrinho', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'cart.html'))
})
app.use('/produto', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'prod.html'))
})
app.use('/produtos', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'produtos.html'))
})
app.use('/registrar', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'criar-conta.html'))
})
app.use('/adm/relatorio', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'admRelatorio.html'))
})
app.use('/adm/produtos', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'admProdutos.html'))
})
app.use('/adm/index', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'admIndex.html'))
})
app.use('/index', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, './public/html/', 'index.html'))
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is up and listening on port:${port}`);
});
