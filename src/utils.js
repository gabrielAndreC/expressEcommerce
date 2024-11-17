import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//bcrypt
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))
export const checkHashed = (password,hash) => bcrypt.compare(password, hash)
//jwt
export const createToken = (user)=>{
    const {id, email, role, cart} = user;
    const token = jwt.sign({id, email, role, cart}, 'clave-re-secreta', {expiresIn: "12h"});
    return token
}
export const verifyToken = (token) =>{
 try {
    const decode = jwt.verify(token, 'clave-re-secreta');

    return decode;

 } catch (error) {
    return null
 }
}
export default __dirname;