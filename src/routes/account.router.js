import { Router } from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import userModel from "../models/user.model.js";
import { checkHashed, createHash, createToken, verifyToken } from "../utils.js";

const router = Router();

router.get("/register", (req,res)=>{
    res.render("register",{style:"main.css"})
})

router.post("/register", passport.authenticate("register"), async (req,res)=>{
    try {
        res.status(201).json({status: "success", msg: "Usuario registrado"})
    } catch (error) {
        console.log(error);
        res.status(501).json({status: "error", msg: "error interno del servidor"})
    }
})

router.get('/login', (req,res)=>{
    res.render("login",{style:"main.css"})
})

router.post('/login', async (req,res)=>{
    
    const user = await userModel.findOne({email: req.body.email.toLowerCase()}).lean()

    if (!user || !user.password){
        return res.render("login",{style:"main.css",msg:"Credenciales incorrectas"})
    }

    if (checkHashed(req.body.password, user.password)){
        const token = createToken(user);

        res.cookie("token",token, {httpOnly: true});
        res.locals.userLogged = user.email;
        res.render("home",{style:"main.css"})
    }
    else{
        res.render("login",{style:"main.css"})
    }
})

router.get("/google", passport.authenticate("google", { 
    scope: ["https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"], 
    session: false}), 
    async (req,res) =>{
        const user = await userModel.findOne({email: req.user.email.toLowerCase()}).lean()
        
        const token = createToken(user);

        res.cookie("token",token, {httpOnly: true});

        res.redirect("/")


        //res.status(200).json({status: "success", payload: req.user})
    }
)

router.post("/auth", async(req,res)=>{
    const {email,password} = req.body;

    const user = await userModel.findOne({email: email})

    if (!user || !checkHashed(password,user.password)){
        return res.status(401).json({status: "error", msg:"Credenciales incorrectas"})
    }

    const token = createToken(user);

    res.cookie("token",token, {httpOnly: true});

    res.status(200).json({status:"succes", payload: token})

})

router.get("/current", async (req,res)=>{
    try {
        const token = req.cookies.token;

        const validToken = verifyToken(token);
        if (!validToken) return res.status(401).json({status:"error", msg: "Token no valido/vencido"})
        
        res.status(200).json({status:"success", payload: token})
    } catch (error) {
        console.log(error)
        res.status(400)
    }

})

export default router;