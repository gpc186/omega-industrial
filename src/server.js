const express = require('express');
const app = express();
const authRoute = require('./routes/authRoute');
const path = require('path');
// const errorHandler = require('./middleware/errorHandler')
const produtoRoute = require('./routes/produtoRoute');
const categoryRoute = require('./routes/categoryRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
require('dotenv').config();

// app.use(errorHandler);

app.use('/uploads', express.static('uploads'));
app.use(express.static("src/public"));

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/product', produtoRoute);
app.use('/api/category', categoryRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);

app.get('/login', (req, res)=>{
    res.status(200).sendFile(path.join(__dirname, 'public', 'html', 'login.html'))
})

app.get('/', (req, res)=>{
    res.send('/')
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is up and listening on port:${port}`);
});
