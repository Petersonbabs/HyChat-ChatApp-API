import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config()
import users from '../models/user.model.js'
import genVerificationToken from '../utils/generateRandomString.js';


const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURITY,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const notify = async (userName, email) => {


    const mailOptions = {
        from: 'HyChat',
        to: email,
        subject: 'Welcome To HyChat',
        text: `Hi ${userName}, welcome to our service! We're thrilled to have you join us. Now that you're here, take some time to explore and create your own events. Dive into a world of opportunities where you can connect, learn, and grow. Let's make something amazing together!`
    };

    await transporter.sendMail(mailOptions);
}

export const sendVerificationEmail = async (userName, email, verificationToken) => {
    const verificationOptions = {
        from: 'HyChat',
        to: email,
        subject: 'Verify Your Account - HyChat',
        sender: 'HyChat',
        // TODO: readfile
        html: `<div class="container">
        <div class="header">
            <h1>Verify Your Account</h1>
        </div>
        <div class="content">
            <p>Hello ${userName},</p>
            <p>Thank you for registering with us. Please click the button below to verify your email address and complete your registration.</p>
            <button style="display: inline-block; border: 'none'; margin-top: 20px; padding: 10px 20px; font-size: 1rem; color: #fff; background-color: #007bff; text-decoration: none;"><a href=${`http://localhost:3000/api/v1/auth/verify/${verificationToken}`} style="color: #fff;  text-decoration: none;">Verify Account</a></button>
            <p>If you did not create an account, no further action is required.</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
        </div>
    </div>`
    }

    await transporter.sendMail(verificationOptions)
}

export const requestVerification = async (req, res) => {
    const { email } = req.body;
    const  user = await users.findOne({ email })
    const {userName} = user

    const verificationToken = genVerificationToken()
    const verificationExpiration = Date.now() + 3600 * 1000
    
    await users.findByIdAndUpdate(user._id, {verificationToken, verificationExpiration})


    if (!user) {
        res.status(403).json({
            status: 'error',
            message: 'Oops! Something is off with your email. Try again.'
        })
        return
    } else if(user.isVerified){
        res.status(400).json({
            status: 'warning',
            message: 'This account has already been verified.'
        })
        return 
    }

    const verificationOptions = {
        from: 'HyChat',
        to: email,
        subject: `${userName}, Verify Your Account - HyChat`,
        sender: 'HyChat',
        html: `<div class="container">
        <div class="header">
            <h1>Verify Your Account</h1>
        </div>
        <div class="content">
            <p>Hello ${userName},</p>
            <p>You requested for a verification link. Please click the button below to verify your email address and complete your registration.</p>

            <button style="display: inline-block; border: 'none'; margin-top: 20px; padding: 10px 20px; font-size: 1rem; color: #fff; background-color: #007bff; text-decoration: none;"><a href=${`http://localhost:3000/api/v1/auth/verify/${verificationToken}`} style="color: #fff;  text-decoration: none;">Verify Account</a></button>
            <p>If you did not request for a verification link, kindly report to us.</p>
        </div>
        <div class="footer">
            <p>© 2024 Your Company. All rights reserved.</p>
        </div>
         </div>`
    }

    await transporter.sendMail(verificationOptions, (err, info) => {
        if (err) {
            console.log(err)
            res.status(404).json({
                status: 'error',
                message: 'unable to send verification email. Try again...'
            })
            return
        }
    })
    
    

    res.status(200).json({
        status: 'success',
        message: `A new verification link has been sent to you. Check your email.`
    })


}

export default notify