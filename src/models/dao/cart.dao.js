import cartModel from "../cart.model.js";
import { ObjectId } from "mongodb";
import ticketModel from "../ticket.model.js";
import { productDao } from "./product.dao.js";

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
            {_id: new ObjectId(id), "products.product": new ObjectId(prodId)},
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

    async clean(cid){
        const cleaned = await cartModel.updateOne(
            {_id: new ObjectId(cid)},
            {products: []}
        );
        return cleaned
    }

    async createTicket(req, user, products){

        let totalPrice = 0;

        let productList = [];
        
        for (const el of products) {
            const productInDb = await productDao.findById(el.product)

            totalPrice += el.quantity * productInDb.price

            productList.push({
                productId: productInDb._id,
                product: productInDb.name,
                quantity: el.quantity, 
                price: productInDb.price
            })   
        }

        const ticket = await ticketModel.create({
            purchaser: user.email,
            adress: req.body.adress,
            fullName: user.full_name,
            totalPrice: totalPrice,
            products: productList
        })

        return ticket
    }
}

export const cartDao = new CartDao;