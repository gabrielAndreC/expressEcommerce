import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const ticketCollection = "tickets";

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        default: () => Math.random().toString(36).substr(2, 8)}
        ,
    purchaser: String,
    fullName: String,
    adress: String,
    totalPrice: Number,
    date: {
        type: Date,
        default: () => {
            const fecha = new Date();
            const zonaHorariaOffset = -3; 
            fecha.setHours(fecha.getHours() + zonaHorariaOffset);
            return fecha;
        }
      },
    products: [{
        productId: {type: mongoose.Schema.Types.ObjectId, ref:"products"},
        product: {type: String},
        quantity: {type: Number},
        price: {type: Number}
    }]
})

ticketSchema.plugin(mongoosePaginate);

const ticketModel = mongoose.model(ticketCollection,ticketSchema);

export default ticketModel;