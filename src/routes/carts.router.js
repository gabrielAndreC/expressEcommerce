import { Router } from "express";
import __dirname from "../utils.js";
import { CartsController } from "../controllers/carts.controller.js";

const router = Router();

const cartsController = new CartsController;

router.get('/', cartsController.getCarts)

router.post('/', cartsController.createCart)

router.get('/:cid', cartsController.getCartById)

router.post('/:cid/product/:pid', cartsController.addToCart)

router.put("/:cid/product/:pid", cartsController.updateQuantity)

router.delete('/', cartsController.deleteCarts)

router.delete('/:cid', cartsController.deleteCartById)

router.delete("/:cid/product/:pid", cartsController.deleteCartProduct)



export default router