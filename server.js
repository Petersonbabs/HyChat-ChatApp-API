import dotenv from 'dotenv'
dotenv.config()
import app from "./app.js"
import connectToDb from './config/db.js'

connectToDb()

const PORT = process.env.PORT || 3000;

// listening to port
app.listen(PORT, ()=>{
    
    console.log("running on port " + PORT)
});