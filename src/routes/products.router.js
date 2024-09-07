import { Router } from "express";
import __dirname from "../utils.js";
import fs from 'fs'

const router = Router();

let products = [];

if (fs.existsSync(__dirname+'/db/products.json')){
 products = JSON.parse(fs.readFileSync(__dirname+'/db/products.json',"utf8"))
}

router.get('/', (req,res)=>{
    res.json(products)
})

router.get('/:pid', (req,res)=>{
    const product = products.find(el => el.id == req.params.pid)
    if(!product){
        res.status(404).send('Producto no encontrado')
    }
    res.json(product)
})

router.put('/:pid', (req,res)=>{
    const product = products.findIndex(el => el.id == req.params.pid)
    const updateProduct = req.body;

    if(product==-1){
        res.status(404).send('Producto no encontrado')
    }
    else{
        products[product] = {...products[product], ...updateProduct}
        if (fs.existsSync(__dirname+'/db/products.json')){
            fs.writeFileSync(__dirname+'/db/products.json',JSON.stringify(products))
        }
        res.status(200).json(products[product])
    }
})

router.post('/', (req,res)=>{
    let newProduct = {}
    newProduct.id = products.length
    newProduct = {...newProduct, ...req.body}
    products.push(newProduct);
    if (fs.existsSync(__dirname+'/db/products.json')){
        fs.writeFileSync(__dirname+'/db/products.json',JSON.stringify(products))
    }
    res.status(201).json(newProduct);
})

router.delete('/:pid', (req,res)=>{
    const productDelete = products.find(el => el.id == req.params.pid);
    if (productDelete){
        products = products.filter(el => el.id != productDelete.id);
        if (fs.existsSync(__dirname+'/db/products.json')){
            fs.writeFileSync(__dirname+'/db/products.json',JSON.stringify(products))
        }
        res.status(200).json(productDelete);
        res.send(products)
    }
    else{
        res.status(404).send('Producto no encontrado')
    }
})


export default router;