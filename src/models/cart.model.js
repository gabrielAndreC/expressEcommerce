import mongoose from "mongoose";

const cartCollection = "carts";

const cartSchema = mongoose.Schema({
    User: {type: mongoose.Schema.Types.ObjectId, ref:"users"},
    products: [{
        product: {type: mongoose.Schema.Types.ObjectId, ref:"products"},
        quantity: {type: Number}
    }]
})

const cartModel = mongoose.model(cartCollection,cartSchema);

export default cartModel