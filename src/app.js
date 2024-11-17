import handlebars  from 'express-handlebars';
import express from 'express';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';
import indexRouter from './routes/index.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import accountRouter from './routes/account.router.js';
import { Server } from "socket.io";
import productModel from './models/product.model.js';
import userModel from './models/user.model.js'
import cartModel from './models/cart.model.js';
import cookieParser from 'cookie-parser';
import { iniPassport } from './config/passport.js';
import passport from 'passport';
import session from 'express-session';

dotenv.config();

const uriConexion = process.env.URIMONGO;

mongoose.connect(uriConexion)

const app = express();


//server http
const httpServer = app.listen(8080, ()=>{ console.log('Listening on 8080 port')});

//iniciar server websocket
const io = new Server(httpServer);

app.use(cookieParser('clave-re-secreta'))


iniPassport();
app.use(session())

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'));

app.use('/',indexRouter);
app.use('/account',accountRouter);

app.use('/api/products',productsRouter);
app.use('/api/carts',cartsRouter);



//encender server socket
io.on('connection',socket=>{
    console.log('cliente conectado')

    let products = []

    const getProducts = async () =>{
       products = await productModel.find()
       socket.emit('enviarProductList',products)
    }

    //Enviar lista
    socket.on('pedirLista',async () =>{
        await getProducts();
    })
    
    //añadir el nuevo objeto y actualizar la lista
    socket.on("añadiendoProducto", async (data) =>{

        let insert = await productModel.create(data)
        await getProducts();
    })

    //eliminar producto por id
    socket.on('eliminarProducto', async (data)=>{
        try {
            let deleteProduct = await productModel.deleteOne({_id: new ObjectId(String(data).trim())});
         } catch (err) {
            console.error(err);
         }
        getProducts();
        socket.emit('enviarProductList',products)
    })
    //Añadir producto a un carrito y crear uno si no 
    socket.on('añadiendoAlCarrito',async(data)=>{

        const prodId = data.id;
        const cartId = data.cart;
        const quantity = data.quantity;
        
        //muestra notificacion de loading
        if (cartId){
            let cart = await cartModel.findOne({_id: new ObjectId(String(cartId))})
                //decide si hay que agregar un nuevo producto al carrito o sumar una cantidad a las unidades existentes
            if (cart){
                let productExist = await cartModel.findOne({_id: new ObjectId(String(cartId)), "products.product":prodId})
                
                if (productExist){
                    const updateCart = await cartModel.updateOne(
                        {_id: new ObjectId(String(cartId)), "products.product": prodId},
                        {$inc: { "products.$.quantity": quantity} }
                    )
                    await cart.save();
                    socket.emit('alert',"Unidad/es añadida/s",cartId)
                }
                else{
                    cart.products.push({"product": new ObjectId(String(prodId)),"quantity":quantity})
                    await cart.save();
                    socket.emit('alert',"Producto añadido",cartId)
                }
            }
        }
    })
})
