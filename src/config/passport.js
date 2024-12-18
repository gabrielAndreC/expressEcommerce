import passport from "passport";
import local from 'passport-local';
import google from 'passport-google-oauth20'
import { createHash } from "../utils.js";
import { cartService } from "../services/carts.service.js";
import { userService } from "../services/user.service.js";
import dotenv from 'dotenv';

dotenv.config();

const clientID = process.env.CLIENTID
const clientSecret = process.env.CLIENTSECRET
const callbackURL = process.env.CALLBACKURL

const LocalStrategy = local.Strategy;
const GoogleStrategy = google.Strategy;

//iniciar estrategias

export const iniPassport = ()=>{
    //local
    //estrat register
    passport.use("register", new LocalStrategy({passReqToCallback: true, usernameField: "email"}, async (req, username, password, done)=>{

        try {
            const {name, lastName, age, role, cart} = req.body;

            const user = await userService.findOnePopulate({email: username }, "cart");

            if (user) return done(null, false, {message: "el usuario ya existe"}); //no error null, no usuario false,
            
            const nuevoCart = await cartService.create({"products": []});

            const nuevoUser = {
                name,
                lastName,
                age,
                role,
                cart: nuevoCart._id,
                email: username,
                password: createHash(password)
            }

            const crearUser = await userService.create(nuevoUser);

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
            const user = await userService.findById(id);
            done(null, user);

        } catch (error) {
            done(error)
        }
    })

    passport.use(new GoogleStrategy({
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL
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
            const userExists = await userService.findOne({email: user.email});
            //si existe...
            if (userExists){
                return cb(null, userExists)
            }
            //si no, lo crea
                const nuevoCart = await cartService.create({"products": []});
                const userCreate = await userService.create({...user, cart: nuevoCart._id})
            return cb(null,userCreate)
        } catch (error) {
            cb(error)
        }
      }
    ));

};

