import cartModel from "../cart.model.js";
import { ObjectId } from "mongodb";

class CartDao{
    async getAll(){
        const carts = await cartModel.find()
        return carts
    }

    async create(data){
        const cart = await cartModel.create(data)
        return cart
    }

    async findOne(id){
        const cart = await cartModel.findOne({_id: new ObjectId(id)})
        return cart
    }

    async findOneLean(id){
        const cart = await cartModel.findOne({_id: new ObjectId(id)}).lean()
        return cart
    }

    async findByProduct(cid,pid){
        const cart = await cartModel.findOne({_id: new ObjectId(cid), "products.product":pid})
        return cart
    }

    async populate(cart,path){
        const populatedCart = await cartModel.populate(cart,path)
        return populatedCart
    }

    async updateOne(id,prodId,update){
        const updated = await cartModel.updateOne(
            {_id: new ObjectId(id), "products.product": prodId},
            update
        );
        return updated
    }

    async deleteMany(){
        const eliminarCarts = await cartModel.deleteMany({});
        return eliminarCarts
    }

    async deleteById(id){
        const eliminarCart = await cartModel.deleteOne({_id: new ObjectId(id)})
        return eliminarCart
    }

    async deleteCartProduct(cid, pid){
        const eliminarProd = await cartModel.updateOne(
            {_id: new ObjectId(cid)},
            {$pull: {products: {id: pid}}}
        )
        return eliminarProd
    }
}

export const cartDao = new CartDao;