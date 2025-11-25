const express = require('express');
const app = express();
const authRoute = require('./routes/authRoute')
require('dotenv').config();

app.use(express.json());

app.use('/auth', authRoute);


app.get('/', (req, res)=>{
    res.send('/')
})

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server is up and listening on port:${port}`);
});
