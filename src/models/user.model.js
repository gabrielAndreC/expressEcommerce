import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    name: {type: String},
    lastName: {type: String,
        default: ""
    },
    email: {
        type: String,
        unique: true
    },
    password: {type: String,
        default: () =>{
            const randomPass = Math.random().toString(36).substr(0, 8)
            const password = `coder.${randomPass}`
            return password
        }
    },
    age: {type: Number,
        default: 0
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"carts"
    }
})

const userModel = mongoose.model(userCollection,userSchema);

export default userModel

