import handlebars  from 'express-handlebars';
import express from 'express';
import indexRouter from './routes/index.router.js';
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from './utils.js';

import fs from 'fs'

import { Server } from "socket.io";

//server http
const app = express();
const httpServer = app.listen(8080, ()=>{ console.log('Listening on 8080 port')});

//iniciar server websocket
const io = new Server(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use('/',indexRouter);

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);

//encender server socket
io.on('connection',socket=>{
    console.log('cliente conectado')

    let products = []

    const getProducts = () =>{
        if (fs.existsSync(__dirname+'/db/products.json')){
            products = JSON.parse(fs.readFileSync(__dirname+'/db/products.json','utf8'))
        }
    }
    getProducts()

    socket.emit('enviarProductList',products)

    //añadir el nuevo objeto y actualizar la lista
    socket.on("añadiendoProducto", data=>{
        const nuevoProducto = data;
        nuevoProducto.id = products.length
        products.push(nuevoProducto)

        if (fs.existsSync(__dirname+'/db/products.json')){
            fs.writeFileSync(__dirname+'/db/products.json',JSON.stringify(products))
        }

        socket.emit('enviarProductList',products)
    })
    //eliminar producto por id
    socket.on('eliminarProducto', data=>{
        //econtrar elemento a eliminar
        const productDelete = products.find(el => el.id == data);
        if (productDelete){
            //sacarlo del array
            products = products.filter(el => el.id != productDelete.id);
            //actualizar el id de cada elemento
            products.forEach(el=>{
                    el.id = products.indexOf(el)
            })
            //editar la lista en db
            if (fs.existsSync(__dirname+'/db/products.json')){
                fs.writeFileSync(__dirname+'/db/products.json',JSON.stringify(products))
            }
            getProducts();
            socket.emit('enviarProductList',products)
        }
    })
})
