import mongoose from "mongoose";
import dotEnv from 'dotenv';
dotEnv.config();

const tempUrl = process.env.MONGODB_URL;
const password = process.env.MONGODB_PASSWORD;
const url = tempUrl.replace('<password>', password); 


const connectToDb = async ()=>{
    mongoose.connect(url)
    .then( ()=>{console.log(`Connected to MongoDb`)})
}

export default connectToDb