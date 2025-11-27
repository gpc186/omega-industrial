const express = require('express');
const app = express();
const authRoute = require('./routes/authRoute');
// const errorHandler = require('./middleware/errorHandler')
const produtoRoute = require('./routes/produtoRoute');
const categoryRoute = require('./routes/categoryRoute');
const cartRoute = require('./routes/cartRoute');
const orderRoute = require('./routes/orderRoute');
require('dotenv').config();

// app.use(errorHandler);

app.use('/uploads', express.static('uploads'));

app.use(express.json());

app.use('/api/auth', authRoute);
app.use('/api/product', produtoRoute);
app.use('/api/category', categoryRoute);
app.use('/api/cart', cartRoute);
app.use('/api/orders', orderRoute);


app.get('/', (req, res)=>{
    res.send('/')
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is up and listening on port:${port}`);
});
