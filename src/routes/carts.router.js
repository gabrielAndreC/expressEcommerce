import { Router } from "express";
import __dirname from "../utils.js";
import cartModel from "../models/cart.model.js";
import { ObjectId } from "mongodb";
import productModel from "../models/product.model.js";

const router = Router();

let carts;

const getCarts = async ()=>{
    carts = await cartModel.find();
}

router.get('/', async(req,res)=>{
    await getCarts()
    res.status(200).json(carts);
})

router.post('/',async (req,res)=>{
    try {
        let nuevoCart = await cartModel.create(req.body);
        await getCarts();
        res.status(200).json(carts)
    } 
    catch (error) {
        console.error("error:",error)
        res.status(400).send("no se ha podido crear el carrito")
    }
    
})

router.get('/:cid',async (req,res)=>{
    let cart = await cartModel.findOne({_id: new ObjectId(req.params.cid)})

    if (cart){
        let result = await cart.populate('products.product')
        res.status(201).json(result)
    }
    
    else{
        res.status(404).send("El carrito no existe aún")
    }
})

router.post('/:cid/product/:pid',async (req,res)=>{
    let cart = await cartModel.findOne({_id: new ObjectId(req.params.cid)})
    
    if (cart){
        const prodId = req.params.pid

        let prodQ = 1;

        if (req.query.q){
            prodQ = parseInt(req.query.q)
        }

        let productExist = await cartModel.findOne({_id: new ObjectId(req.params.cid), "products.product":prodId})

        if (productExist){
            const updateCart = await cartModel.updateOne(
                {_id: new ObjectId(req.params.cid), "products.product": prodId},
                {$inc: { "products.$.quantity": prodQ} }
            );
            cart = await cartModel.findOne({ _id: new ObjectId(req.params.cid) });
            res.status(200).json(cart)
        }
        else{
            cart.products.push({"product": new ObjectId(prodId),"quantity":prodQ})
            await cart.save();
            cart = await cartModel.findOne({ _id: new ObjectId(req.params.cid) });
            res.status(200).json(cart)
        }
    }
    
    else{
        res.status(404).send("El carrito no existe aún")
    }
})

router.put("/:cid/product/:pid", async (req,res)=>{
    const actualizarQuantity = await cartModel.updateOne(
        {_id: new ObjectId(req.params.cid), "products.id": req.params.pid},
        {$set: {"products.$.quantity": req.body.quantity}}
    )
    let cart = await cartModel.findOne({ _id: new ObjectId(req.params.cid) });
    res.status(200).json(cart)
})

router.delete('/',async (req,res)=>{
    const eliminarCarts = await cartModel.deleteMany({});
    await getCarts();
    res.status(200).json(carts)
})

router.delete('/:cid',async (req,res)=>{
    const eliminarCart = await cartModel.deleteOne({_id: new ObjectId(req.params.cid)})
    await getCarts();
    res.status(200).json(carts)
})

router.delete("/:cid/product/:pid", async (req,res)=>{
    const eliminarProd = await cartModel.updateOne(
        {_id: new ObjectId(req.params.cid)},
        {$pull: {products: {id: req.params.pid}}}
    )
    let cart = await cartModel.findOne({ _id: new ObjectId(req.params.cid) });
    res.status(200).json(cart)
})



export default router