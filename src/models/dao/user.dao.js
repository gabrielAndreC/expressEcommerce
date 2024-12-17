import userModel from "../user.model.js";
import { ObjectId } from "mongodb";

class UserDao{
    async findById(id){
        const user = await userModel.findOne({_id: new ObjectId(id)})
        return user
    }

    async findOne(filter){
        const user = await userModel.findOne(filter)
        return user
    }
    
    async findOneLean(filter){
        const user = await userModel.findOne(filter).lean()
        return user
    }

    async findOnePopulate(filter, populate){
        const user = await userModel.findOne(filter).populate(populate)
        return user
    }

    async create(data){
        const user = await userModel.create(data)
        return user
    }
}

export const userDao = new UserDao;