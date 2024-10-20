import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type:String},
    password: {type:String},
    cart: {type: mongoose.Schema.Types.ObjectId, ref:"carts"}
})

const userModel = mongoose.model(userCollection,userSchema);

export default userModel

