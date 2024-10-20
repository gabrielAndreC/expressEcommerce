import { Router } from "express";
import __dirname from "../utils.js";
import { ObjectId } from "mongodb";
import productModel from '../models/product.model.js';

const router = Router();

router.get('/', async (req,res)=>{
    let products = await productModel.find()    
    res.json(products)
})

router.get('/:pid', async(req,res)=>{
    let product = await productModel.findOne({_id: new ObjectId(req.params.pid)})
    if(!product){
        res.status(404).send('Producto no encontrado')
    }
    res.json(product)
})

router.put('/:pid', async (req,res)=>{
    let product = await productModel.findOne({_id: new ObjectId(req.params.pid)})

    if(!product){
        res.status(404).send('Producto no encontrado')
    }
    else{
        let updateProduct = await productModel.updateOne(product, req.body)
        product = await productModel.findOne({_id: new ObjectId(req.params.pid)})
        res.status(200).json(product)
    }
})

router.post('/', async(req,res)=>{
    let newProduct = await productModel.create(req.body)
    res.status(201).json(newProduct);
})

router.delete('/:pid', async (req,res)=>{
    if (req.params.pid.length == 24){
        let prodToDelete = await productModel.findOne({_id: new ObjectId(req.params.pid)});
        if (prodToDelete){
            let prodDelete = await productModel.deleteOne({_id: new ObjectId(req.params.pid)})
            res.status(200).json(prodToDelete);
        }
        else{
            res.status(404).send('Producto no encontrado')
        }
    }
    else{
        res.status(404).send('Producto no encontrado')
    }
})


export default router;