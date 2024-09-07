import { Router } from "express";
import __dirname from "../utils.js";
import fs from 'fs'

const router = Router();

let carts = [];
if (fs.existsSync(__dirname+'/db/carts.json')){
    carts = JSON.parse(fs.readFileSync(__dirname+'/db/carts.json','utf8'))
}

router.get('/',(req,res)=>{
    res.status(200).json(carts);
})

router.post('/',(req,res)=>{
    const newCartId = (carts.length);
    const cart = {
        "id":newCartId,
        "products":[]
    }
    carts.push(cart)
    if (fs.existsSync(__dirname+'/db/carts.json')){
        fs.writeFileSync(__dirname+'/db/carts.json',JSON.stringify(carts))
    }
    res.status(200).json(carts)
})

router.get('/:cid',(req,res)=>{
    const cart = carts.find(el => el.id == req.params.cid)

    if (cart){
        res.status(201).json(cart)
    }
    
    else{
        res.status(404).send("El carrito no existe aún")
    }
})

router.post('/:cid/product/:pid',(req,res)=>{
    const cart = carts.find(el => el.id == req.params.cid)
    
    if (cart){
        const prodId = req.params.pid
        const prodQ = parseInt(req.query.quantity)

        if (cart.products.find(el => el.id === prodId)){
            const productIndex = cart.products.findIndex(el => el.id === prodId);
            cart.products[productIndex].quantity += prodQ;
        }
        else{
            cart.products.push({"id":prodId,"quantity":prodQ})
        }
        
        if (fs.existsSync(__dirname+'/db/carts.json')){
            fs.writeFileSync(__dirname+'/db/carts.json',JSON.stringify(carts))
        }
        res.status(200).json(cart)
    }
    
    else{
        res.status(404).send("El carrito no existe aún")
    }
})

router.delete('/',(req,res)=>{
    carts = [];
    if (fs.existsSync(__dirname+'/db/carts.json')){
        fs.writeFileSync(__dirname+'/db/carts.json',JSON.stringify(carts))
    }
    res.status(200).json(carts)
})

export default router