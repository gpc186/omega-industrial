const express = require('express');
const app = express();
const authRoute = require('./routes/authRoute');
const produtoRoute = require('./controllers/produtoController');
const categoryRoute = require('./routes/categoryRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
require('dotenv').config();

app.use(express.json());

app.use('/auth', authRoute);
app.use('/produto', produtoRoute);
app.use('/category', categoryRoute);
app.use('/cart', cartRoute);
app.use('/orders', orderRoute);

app.get('/', (req, res)=>{
    res.send('/')
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is up and listening on port:${port}`);
});