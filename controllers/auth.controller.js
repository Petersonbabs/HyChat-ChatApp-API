import users from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from "../services/sendEmail.nodemailer.js";
import generateToken from "../utils/genToken.js";
import genVerificationToken from "../utils/generateRandomString.js";

// Register user
export const signUp = async (req, res, next) => {
    const { fullName, userName, email, password, confirmPassword, phoneNumber } = req.body
    try {

        if (!fullName || !userName || !email || !password || !confirmPassword || !phoneNumber) {
            res.status(400).json({
                status: 'error',
                message: 'Please complete the form'
            })
        }

        if (password !== confirmPassword) {
            res.status(404).json({
                status: 'error',
                message: 'Passwords do not match'
            })
            return
        }


        // TODO: generate random profile picture
        const profilePic = `https://ui-avatars.com/api/?background=020024&color=fff&name=${userName}`
        const verificationToken = genVerificationToken()
        const verificationExpiration = Date.now() + 360000

        const user = await users.create({ profilePic, verificationToken, verificationExpiration, ...req.body })



        if (!user) {
            res.status(404).json({
                status: 'error',
                message: 'Unable to create user.'
            })
        }


        // TODO: Send verification email.
        sendVerificationEmail(userName, email, verificationToken)

        // TODO: generate token
        const token = generateToken(email, user._id)

        res.status(201).json({
            status: 'success',
            message: 'Signup successful. Check your email to verify your account.',
            user,
            token
        })


    } catch (error) {
        console.log(error)
        next(error)
    }

}

// Login user
export const login = async (req, res) => {
    res.send('login')
}

// update user
export const updateUser = async (req, res) => {
    res.send('update')

}

// Logout user
export const logout = async (req, res) => {
    res.send('logout')

}

// Delete user
export const deleteUser = async (req, res) => {

    const { id } = req.params
    try {
        await users.findByIdAndDelete(id)
        const user = await users.findById(id)
        if(user){
            res.status(400).json({
                status: 'error',
                message: 'Oop! User was not deleted.'
            })
        }

        res.status(204).json({
            status: 'success',
            message: 'Account was successfully deleted.'
        })
        
    } catch (error) {
        console.log('error occured at deleteUser controller: ' + error);
        next(error)
    }

}


export const verifyUser = async (req, res, next) => {
    const { token } = req.params
    try {
        const user = await users.findOne({ verificationToken: token, verificationExpiration: { $gt: Date.now() } })


        // check is the provided token hasn't expired yet
        if (!user) {

            res.status(400).json({
                status: 'error',
                message: 'Oops! It looks like your verification link has expired or used. Request for another one.'
            })

        }

        await users.findByIdAndUpdate(user._id, {isVerified: true, verificationExpiration: null, verificationToken: null })

        res.status(200).json({
            status: 200,
            message: 'Verification successful. Redirecting...',
            user
        })

    } catch (error) {
        console.log('Error at verifyUser Middleware ' + error)
        next(error)
    }
}
