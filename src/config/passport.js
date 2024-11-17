import passport from "passport";
import local from 'passport-local';
import google from 'passport-google-oauth20'
import userModel from "../models/user.model.js";
import cartModel from "../models/cart.model.js";
import { createHash } from "../utils.js";

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;

//iniciar estrategias

export const iniPassport = ()=>{
    //local
    //estrat register
    passport.use("register", new LocalStrategy({passReqToCallback: true, usernameField: "email"}, async (req, username, password, done)=>{

        try {
            const {name, lastName, age, role, cart} = req.body;

            const user = await userModel.findOne({email: username }).populate("cart");

            if (user) return done(null, false, {message: "el usuario ya existe"}); //no error null, no usuario false,
            
            const nuevoCart = await cartModel.create({"products": []});

            const nuevoUser = {
                name,
                lastName,
                age,
                role,
                cart: nuevoCart._id,
                email: username,
                password: createHash(password)
            }

            const crearUser = await userModel.create(nuevoUser);

            return done(null, crearUser,)

        } catch (error) {
            return done(error)
        }

    }))

    passport.serializeUser((user,done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async (id,done)=>{
        try {
            const user = await userModel.findById(id);
            done(null, user);

        } catch (error) {
            done(error)
        }
    })

    passport.use(new GoogleStrategy({
        clientID: "669237819697-1frpfbkkveqmkq2c2ik7qij8e2mlkkp8.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/account/google"
      },
      async (accessToken, refreshToken, profile, cb) => {
        /*
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
          return cb(err, user);
        });*/
        try {
            //data de gooogle auth del usuario
            const {id, name, emails} = profile;

            const user = {
                name: name.givenName,
                lastName: name.familyName,
                email: emails[0].value
            }
            //busca
            const userExists = await userModel.findOne({email: user.email});
            //si existe...
            if (userExists){
                return cb(null, userExists)
            }
            //si no, lo crea
                const nuevoCart = await cartModel.create({"products": []});
                const userCreate = await userModel.create({...user, cart: nuevoCart._id})
            return cb(null,userCreate)
        } catch (error) {
            cb(error)
        }
      }
    ));

};

