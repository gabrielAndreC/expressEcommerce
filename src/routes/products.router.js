import { Router } from "express";
import __dirname from "../utils.js";
import { ProductsController } from "../controllers/products.controller.js";

const router = Router();

const productsController = new ProductsController

router.get('/', productsController.getProducts)

router.get('/:pid', productsController.getProductById)

router.put('/:pid', productsController.updateProduct)

router.post('/', productsController.createProduct)

router.delete('/:pid', productsController.deleteProduct)


export default router;