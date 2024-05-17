import crypto from 'crypto'

const randomString =  (email, password)=>{

    const randomString = crypto.randomBytes(32).toString('hex');

    return randomString
    
}

export default randomString