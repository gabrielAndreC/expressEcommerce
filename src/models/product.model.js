import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productCollection = "products";

const productSchema = mongoose.Schema({
    name: String,
    categ: String,
    desc: String,
    price: Number,
    stock: Number
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection,productSchema);

export default productModel;