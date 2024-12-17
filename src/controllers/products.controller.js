import { productService } from "../services/product.service.js";

export class ProductsController{
    async getProducts(req,res){
        const products = await productService.getAll()   
        res.json(products)
    }

    async getProductById(req,res){
        let product = await productService.findById(req.params.pid)
        if(!product){
            res.status(404).send('Producto no encontrado')
        }
        res.json(product)
    }

    async updateProduct(req,res){
        await productService.updateProduct(res, req.params.pid, req.body)
    }

    async createProduct(req,res){
        let newProduct = await productService.create(req.body)
        res.status(201).json(newProduct);
    }

    async deleteProduct(req,res){
        await productService.deleteProduct(res, req.params.pid)
    }
}
