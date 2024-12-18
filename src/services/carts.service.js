import { cartDao } from "../models/dao/cart.dao.js";
import { ObjectId } from "mongodb";
import { productDao } from "../models/dao/product.dao.js";
import { userDao } from "../models/dao/user.dao.js";
import { UserResponseDto } from "../dto/user.dto.js";

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

    async purchaseProcess(req, res, cid){

        const user = await userDao.createDTO({cart: new ObjectId(cid)})
        
        const productsInCart = await cartDao.findOneLean(cid)

        let notAvailable = [];

        for (const el of productsInCart.products) {
            const productInDb = await productDao.findById(el.product);
    
            if (productInDb) {
                if (el.quantity > productInDb.stock) {
                    notAvailable.push({ ...el, currentStock: productInDb.stock, name: productInDb.name });
                }
                else{
                    const productSub = await productDao.updateOne(productInDb,
                        {stock: (productInDb.stock - el.quantity)}
                    )
                }
            }
        }
    
        if (notAvailable.length > 0) {
            const status = { status: "cancel", products: notAvailable };
            return status;
        }

        const ticket = await cartDao.createTicket(req, user, productsInCart.products)
        
        const cart = cartDao.clean(cid)

        const status = {status: "done", ticket}

        return status
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