import { userDao } from "../models/dao/user.dao.js";

class UserService{
    async create(data){
        const user = await userDao.create(data)
        return user;
    }

    async findById(id){
        const user = userDao.findById(id)
        if (!user) return null;
        return user
    }

    async findOne(filter){
        const user = await userDao.findOne(filter)
        if (!user) return null;
        return user;
    }
    
    async findOneLean(filter){
        const user = await userDao.findOneLean(filter)
        if (!user) return null;
        return user;
    }

    async findOnePopulate(filter,populate){
        const user = await userDao.findOnePopulate(filter,populate)
        return user;
    }
}

export const userService = new UserService