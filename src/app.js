import handlebars  from 'express-handlebars';
import express from 'express';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { ObjectId } from "mongodb";
import dotenv from 'dotenv';
import indexRouter from './routes/index.router.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import { Server } from "socket.io";
import productModel from './models/product.model.js';
import userModel from './models/user.model.js'
import cartModel from './models/cart.model.js';

dotenv.config();

const uriConexion = process.env.URIMONGO;

mongoose.connect(uriConexion)

const app = express();

//server http
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
    let isLogged = false;

    const getProducts = async () =>{
       products = await productModel.find()
       socket.emit('enviarProductList',products)
    }

    const checkSesion = ()=>{
        socket.emit("checkSesion")
    }

    socket.on("isLogged",(data)=>{isLogged=data})    

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

    //Registrar Usuario
    socket.on("nuevoRegistro", async (data)=>{
        const user = data;
        user.email = user.email.toLowerCase();
        
        let check = await userModel.findOne({email: user.email})

        if (check){
            socket.emit("registroFallido")
            console.log(check);
        }else{
            let nuevoCart = await cartModel.create({"products": []});
            let nuevoUser = await userModel.create({...user,"cart":nuevoCart._id})
            socket.emit("registroExitoso")
        }
    })
    //Iniciar Sesion
    socket.on("nuevoInicio",async (data)=>{
        const log = data;
        let user = await userModel.findOne({email: log.email.toLowerCase()})

        if (user && data.password == user.password){
            socket.emit("inicioExitoso",user)
        }else{
            socket.emit("inicioFallido")
        }

    })
    //Añadir producto a un carrito y crear uno si no 
    socket.on('añadiendoAlCarrito',async(data)=>{
        if (!data.cart){isLogged = false; checkSesion()}

        const prodId = data.id;
        const cartId = data.cart;
        const quantity = data.quantity;
        
            //pregunta al cliente si hay una sesion iniciada y asociada a un cart
        checkSesion()
            
            socket.emit("cargandoProducto")

        setTimeout(async ()=>{
                //el timeout le da tiempo a que el server y el client se comuniquen
            if (isLogged){
                //muestra notificacion de loading
                    //si hay una sesion busca el carrito asociado y lo guarda en cart
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
        }, 3000)
    })
})
