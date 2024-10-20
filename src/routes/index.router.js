import { Router } from "express";
import __dirname from "../utils.js";
import productModel from "../models/product.model.js";
import cartModel from "../models/cart.model.js";
import {ObjectId} from 'mongodb';

const router = Router();

router.get('/', (req,res)=>{
    res.render("home",{style:"main.css"})
})

router.get('/login', (req,res)=>{
    res.render("login",{style:"main.css"})
})

router.get('/products', async (req,res)=>{
    let page = parseInt(req.query.page);
    let row = parseInt(req.query.row)

    if (!page) page = 1;
    if (!row) row = 10;

    let result = await productModel.paginate({},{page, limit:row, lean:true})

    result.isValid = !(page < 1 || page > result.totalPages);
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&row=${row}` : '';
    result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&row=${row}` : '';
    res.render("products",{result,style:"main.css"})
})

router.get('/products/:pid', async (req,res)=>{
    let product = req.params.pid;
    let result;
    if (product.length == 24){
        result = await productModel.findOne({_id: new ObjectId(product)}).lean();
    }
    else{
        result = 0;
    }
    res.render("productsSingle",{result,style:"main.css"})
})

router.get('/carts/:cid', async (req,res)=>{
    let cart;

    if (req.params.cid.length ==24){
        cart = await cartModel.findOne({_id: new ObjectId(req.params.cid)}).lean()
    }

    if (cart) {
        const populatedCart = await cartModel.populate(cart, { path: 'products.product' });

        // Simplificando la estructura, no pude pasar directamente populatedCart al handlebar
        const products = populatedCart.products.map(item => ({
            //el metodo spread no funcionó (...item, quantity:item.quantity)
            id: item.product._id,
            name: item.product.name,
            categ: item.product.categ,
            desc: item.product.desc,
            price: item.product.price,
            quantity: item.quantity,
            totalPrice: item.product.price * item.quantity
        }));

        res.render("cart", { result: products, style: "main.css" });
    }
    else{
        res.status(404).send("El carrito no existe.")
    }
})

router.get('/statusQuery', async (req,res)=>{
    
    let page = parseInt(req.query.page);
    let row = parseInt(req.query.row)

    if (!page) page = 1;
    if (!row) row = 10;

    let result = await productModel.paginate({},{page, limit:row, lean:true})

    result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}&row=${row}` : '';
    result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}&row=${row}` : '';
    
    res.json(result)
})

router.get('/realtimeproducts', (req,res)=>{
    res.render("realTimeProducts",{
        style:'main.css'
    })
})

export default router