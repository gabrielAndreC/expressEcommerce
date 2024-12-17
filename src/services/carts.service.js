import { cartDao } from "../models/dao/cart.dao.js";
import { ObjectId } from "mongodb";

class CartService{
    async getAll(){
        const carts = await cartDao.getAll()
        return carts;
    }

    async create(data){
        const cart = await cartDao.create(data)
        return cart;
    }

    async findOne(id){
        const cart = await cartDao.findOne(id)
        return cart;
    }

    async findOneLean(id){
        const cart = await cartDao.findOneLean(id)
        return cart;
    }

    async populate(cart,path){
        const populated = await cartDao.populate(cart,path)
        return populated;
    }

    async updateOne(id,prodId,update){
        const updateCart = await cartDao.updateOne(id,prodId,update)
        return updateCart;
    }

    async findByProduct(cid,pid){
        const cart = await cartDao.findByProduct(cid,pid)
        if (!cart) return null;
        return cart
    }

    async addToCart(cart, cid, pid, prodQ){
        await cart.products.push({"product": new ObjectId(pid),"quantity":prodQ})
        await cart.save();
        const updatecart = await cartDao.findOne(cid);
        return updatecart;
    }

    async deleteMany(){
        const deleted = await cartDao.deleteMany({})
        return deleted;
    }

    async deleteById(id){
        const deleted = await cartDao.deleteById(id)
        return deleted;
    }

    async deleteCartProduct(cid,pid){
        const deleted = await cartDao.deleteCartProduct(cid,pid)
        return deleted;
    }
}

export const cartService = new CartService;