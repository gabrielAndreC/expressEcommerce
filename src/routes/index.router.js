import { Router } from "express";
import __dirname from "../utils.js";
import fs from 'fs';

const router = Router();

router.get('/', (req,res)=>{
    let products = [] 
    if (fs.existsSync(__dirname+'/db/products.json')){
        products = JSON.parse(fs.readFileSync(__dirname+'/db/products.json','utf8'))
    }
    res.render("home",{
        productsList:products,
        style:'products.css'
    })
})

router.get('/realtimeproducts', (req,res)=>{
    res.render("realTimeProducts",{
        style:'products.css'
    })
})

export default router