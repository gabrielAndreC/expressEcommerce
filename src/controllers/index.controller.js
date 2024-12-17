import { cartService } from "../services/carts.service.js";
import { productService } from "../services/product.service.js";
import { verifyToken } from "../utils.js";

export class IndexController {

    async getProducts(req,res) {

        let page = parseInt(req.query.page);
        let row = parseInt(req.query.row)

        if (!page) page = 1;
        if (!row) row = 10;

        let result = await productService.paginate({},{page, limit:row, lean:true})

        result.isValid = !(page < 1 || page > result.totalPages);
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/products?page=${result.prevPage}&row=${row}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/products?page=${result.nextPage}&row=${row}` : '';
        res.render("products",{result,style:"main.css"})
    }

    async getProductById(req,res){

        let product = req.params.pid;
        let result;
        if (product.length == 24){
            result = await productService.findOneLean(product);
        }
        else{
            result = 0;
        }
        res.render("productsSingle",{result,style:"main.css"})
    }

    async getCart(req,res){

        let cart;

        if(!res.locals.cartId || req.params.cid != res.locals.cartId) return res.redirect("/account/login")

        if (req.params.cid.length ==24){
            cart = await cartService.findOneLean(req.params.cid)
        }

        if (cart) {
            const populatedCart = await cartService.populate(cart, { path: 'products.product' });

            // Simplificando la estructura, no pude pasar directamente populatedCart al handlebar
            const products = populatedCart.products.map(item => ({
                //el metodo spread no funcionó (...item, quantity:item.quantity)
                id: item.product._id,
                name: item.product.name,
                categ: item.product.categ,
                desc: item.product.desc,
                price: item.product.price,
                quantity: item.quantity,
                totalPrice: item.product.price * item.quantity
            }));

            res.render("cart", { result: products, style: "main.css" });
        }
        else{
            res.status(404).send("El carrito no existe.")
        }
    }

    async addToCart(req,res,next){

        const cartId = verifyToken(req.cookies.token).cart

        let cart = await cartService.findOne(cartId);
        
        const alerta = {
            title: "¡Éxito!",
            text: "El producto/unidad fue añadido al carrito",
            icon: "success"
          };

        if (cart){
            const prodId = req.params.pid

            let prodQ = 1;
            
            let productExist = await cartService.findByProduct(cartId, prodId)
            
            if (req.body.quantity){
                prodQ = parseInt(req.body.quantity)
            }

            if (productExist){
                const updateCart = await cartService.updateOne(cartId, prodId, {$inc: { "products.$.quantity": prodQ}});
                cart = await cartService.findOne(cartId);
                alerta.text = "Unidad/es añadida/s al carrito"
            }
            else{
                const cartAdded = cartService.addToCart(cart, cartId, prodId, prodQ)
                alerta.text = "El producto fue añadido al carrito"
            }
        }
        else{
            res.status(404).send("El carrito no existe aún")
        }

        let product = req.params.pid;
        let result;
        if (product.length == 24){
            result = await productService.findOneLean(product);
        }
        else{
            result = 0;
        }

        res.render("productsSingle",{result, style:"main.css", alerta: JSON.stringify(alerta)})
    }

    async getStatusQuery(req,res){

        let page = parseInt(req.query.page);
        let row = parseInt(req.query.row)

        if (!page) page = 1;
        if (!row) row = 10;

        let result = await productService.paginate({},{page, limit:row, lean:true})

        result.nextLink = result.hasNextPage ? `http://localhost:8080/?page=${result.nextPage}&row=${row}` : '';
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/?page=${result.prevPage}&row=${row}` : '';
        
        res.json(result)
    }

    async getRealTimeProducts(req,res){
        
        const role = req.signedCookies.userRole;
        let admin = false;
        if (role){
            if (role == "admin") {admin = true}
        }
        res.render("realTimeProducts",{
            style:'main.css',
            admin
        })
    }
}