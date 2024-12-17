import { productDao } from "../models/dao/product.dao.js";

class ProductService{
    async create(data){
        const product = productDao.create(data)
        return product
    }

    async getAll(){
        const products = await productDao.getAll();
        if (!products) return null;
        return products
    }

    async findById(id){
        const product = await productDao.findById(id);
        if (!product) return null;
        return product
    }

    async findOneLean(id){
        const product = productDao.findOneLean(id);
        if (!product) return null;
        return product
    }

    async updateProduct(res, pid, data){
        let product = await productDao.findById(pid)

        if(!product){
            return res.status(404).send('Producto no encontrado')
        }
        else{
            let updateProduct = await productDao.updateOne(product, data)
            product = await productDao.findById(pid)
            return res.status(200).json(product)
        }
    }
    async deleteOne(id){
        const deleted = await productDao.deleteOne(id);
        return deleted
    }
    async deleteProduct(res, pid){
        if (pid.length == 24){
            let prodToDelete = await productDao.findById(pid);
            if (prodToDelete){
                let prodDelete = await productDao.deleteOne(pid)
                res.status(200).json(prodToDelete);
            }
            else{
                res.status(404).send('Producto no encontrado')
            }
        }
        else{
            res.status(404).send('Producto no encontrado')
        }
    }

    async paginate(filter,options){
        const paginated = productDao.paginate(filter,options)
        return paginated
    }
}

export const productService = new ProductService;