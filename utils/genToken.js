import jwt from 'jsonwebtoken'

const generateToken = (email, id, res)=>{

    const token = jwt.sign({email, id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION})
    return token

    // res.cookies('jwt', token, {
    //     maxAge: 25 * 24 * 60 * 60 * 1000,
    //     httpOnly: true
    // })

}

export default generateToken