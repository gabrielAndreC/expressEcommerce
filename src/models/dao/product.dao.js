import productModel from "../product.model.js";
import { ObjectId } from "mongodb";

class ProductDao{
    async getAll(){
        const products = await productModel.find()
        return products
    }

    async findById(id){
        const product = productModel.findOne({_id: new ObjectId(id)})
        return product
    }

    async findOneLean(id){
        const product = productModel.findOne({_id: new ObjectId(id)}).lean()
        return product
    }

    async create(data){
        const product = await productModel.create(data)
        return product
    }

    async deleteOne(id){
        const deleted = await productModel.deleteOne({_id: new ObjectId(id)})
        return deleted
    }

    async updateOne(product, data){
        const updated = await productModel.updateOne(product,data)
        return updated
    }

    async paginate(filter,options){
        const paginated = productModel.paginate(filter,options)
        return paginated
    }
}

export const productDao = new ProductDao;