import jwt from 'jsonwebtoken'
import user from '../models/user.model.js';

const isAuthenticated = (req, res, next)=>{
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, )
    const user = user.findById(decoded.id)

    if(!user){
        return
    }

    req.user = user
    next()
}

const isVerified = (req, res, next) => {
    
}


export default isAuthenticated