import { cartService } from "../services/carts.service.js";

export class CartsController{
    async getCarts(req,res){
        const carts = await cartService.getAll()
        res.status(200).json(carts);
    }

    async createCart(req,res){
        try {
            let nuevoCart = await cartService.create(req.body);
            const carts = await cartService.getAll()
            res.status(200).json(carts)
        } 
        catch (error) {
            console.error("error:",error)
            res.status(400).send("no se ha podido crear el carrito")
        }
    }

    async getCartById(req,res){
        let cart = await cartService.findOne(req.params.cid);

        if (cart){
            let result = await cart.populate('products.product')
            res.status(201).json(result)
        }
        
        else{
            res.status(404).send("El carrito no existe aún")
        }
    }

    async addToCart(req,res){
        let cart = await cartService.findOne(req.params.cid);
    
        if (cart){
            const prodId = req.params.pid

            let prodQ = 1;
            
            let productExist = await cartService.findByProduct(req.params.cid, prodId)
            
            if (req.query.q){
                prodQ = parseInt(req.query.q)
            }
            
            if (productExist){
                const updateCart = await cartService.updateOne(req.params.cid, prodId, {$inc: { "products.$.quantity": prodQ}});

                cart = await cartService.findOne(req.params.cid);
                res.status(200).json(cart)
            }
            else{
                cartAdded = cartService.addToCart(cart, req.params.cid, prodId, prodQ)
                res.status(200).json(cartAdded)
            }
        }
        else{
            res.status(404).send("El carrito no existe aún")
        }
    }

    async updateQuantity(req,res){
        const actualizarQuantity = cartService.updateOne(req.params.cid, prodId, {$set: {"products.$.quantity": req.body.quantity}})
        let cart = await cartService.findOne(req.params.cid);
        res.status(200).json(cart)
    }

    async deleteCarts(req,res){
        const eliminarCarts = await cartService.deleteMany();

        const carts = await cartService.getAll()
        res.status(200).json(carts)
    }

    async deleteCartById(req,res){
        const eliminarCart = await cartService.deleteById(req.params.cid)

        const carts = await cartService.getAll()
        res.status(200).json(carts)
    }

    async deleteCartProduct(req,res){
        const eliminarProd = await cartService.deleteCartProduct(cid,pid)

        let cart = await cartService.findOne(req.params.cid);
        res.status(200).json(cart)
    }
}