import { Router } from "express";
import passport from "passport";
import { AccountController } from "../controllers/account.controller.js";

const router = Router();

const accountController = new AccountController;

router.get("/register", (req,res)=>{
    res.render("register",{style:"main.css"})
})

router.post("/register", passport.authenticate("register"), accountController.register)


router.get('/login', (req,res)=>{
    res.render("login",{style:"main.css"})
})

router.post('/login', accountController.login)

router.get("/google", passport.authenticate("google", { 
    scope: ["https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile"], 
    session: false}), 
    accountController.passportGoogleAuth
)

router.post("/auth", accountController.auth)

router.get("/current", accountController.getCurrent)

export default router;