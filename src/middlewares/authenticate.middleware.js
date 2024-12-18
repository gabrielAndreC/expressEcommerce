import { request, response } from "express";

export const authenticateMw = (role) =>{
    return async (req = request, res = response, next) => {

        if(!req.cookies.token) return res.status(401).json({status: "error", msg: "Unauthorized"});

        if(req.signedCookies.userRole !== role) return res.status(403).json({status: "error", msg: "No permission"})
    
        next();
    }
}