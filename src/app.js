import express from 'express'
import indexRouter from './routes/index.router.js';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'

const app = express();
app.listen(8080, ()=>{
    console.log('Listening on 8080 port')
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use('/',indexRouter);
app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);