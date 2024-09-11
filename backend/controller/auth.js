import bcrypt from "bcrypt";
import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import CONSTANT from '../constant/constant.js';
import User from "../modal/user.js";
import MAILER from '../helper/nodemailer.js';

dotenv.config();
const { RouteCode } = CONSTANT;
const { JWT_SECRET_KEY, SALT } = process.env;

const postLogin = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        let validateUser = await User.findOne({ email: userEmail });
        if (!validateUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Account not active. Contact Admin for Support!' });
        }

        // Check if password matches
        const isCorrectPassowrd = await bcrypt.compare(userPassword.toString(), validateUser.password);
        if (!isCorrectPassowrd) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Password is incorrect' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ email: validateUser.email }, JWT_SECRET_KEY, { expiresIn: '1d' });
        // Setting a cookie with domain and path options
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});

        // Returnable User Data
        const returnedData = {
            userID: validateUser._id,
            userEmail: validateUser.email,
            userName: validateUser.firstName + ' ' + validateUser.lastName,
            token: jwtToken,
            isAdmin: validateUser.isAdmin,
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(returnedData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
const getLogout = async (req, res) => {
    try {
        const token = req.cookies.tkn;
        if (!token) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: RouteCode.UNAUTHORIZED.message });
        }

        // Clear the token cookie
        res.clearCookie('tkn', { secure: true, httpOnly: true });

        // Return success message
        return res.status(RouteCode.SUCCESS.statusCode).json({ message: 'Logged-Out Successfully!' });
    } catch (err) {
        console.error('Error during logout:', err);
        return res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message });
    }
};


// Public Controller
const postPublicRegister = async (req, res) => {
    const { firstName, lastName, userEmail, userPassword, userPhone } = req.body;
    try {
        let userByEmail = await User.findOne({ email: userEmail });
        if (userByEmail) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Email already exists' });
        }

        let userByMobile = await User.findOne({ phone: userPhone });
        if (userByMobile) {
            return res.status(RouteCode.CONFLICT.statusCode).json({ message: 'Mobile number already exists' });
        }

        const hashedPassword = await bcrypt.hash(userPassword.toString(), Number(SALT));

        // Create and save the new user
        let newUser = new User({
            firstName: firstName,
            lastName: lastName, 
            email: userEmail,
            phone: userPhone, 
            password: hashedPassword,
            isAdmin: false,
            role: "Customer",
            cart: [],
            wishlist: [],
        });

        await newUser.save();

        const savedUser = await User.findOne({email: userEmail, phone: userPhone});
        if(!savedUser){
            return res.status(RouteCode.EXPECTATION_FAILED.statusCode).json({message: 'Something went wrong, Try later!'});
        }

        const returnedData = {
            userEmail: savedUser.email, 
            userID: savedUser._id,
            userName: savedUser.firstName + ' ' + savedUser.lastName,
            userPhone: savedUser.phone,
            cart: [],
        };
        res.status(RouteCode.SUCCESS.statusCode).json(returnedData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
}
const postPublicLogin = async (req, res) => {
    const { userEmail, userPassword } = req.body;
    try {
        let validateUser = await User.findOne({ email: userEmail });
        if (!validateUser) {
            return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Account not active. Contact Admin for Support!' });
        }

        // Check if password matches
        const isCorrectPassowrd = await bcrypt.compare(userPassword.toString(), validateUser.password);
        if (!isCorrectPassowrd) {
            return res.status(RouteCode.UNAUTHORIZED.statusCode).json({ message: 'Password is incorrect' });
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ email: validateUser.email }, JWT_SECRET_KEY, { expiresIn: '1d' });
        // Setting a cookie with domain and path options
        res.cookie('tkn', jwtToken, { secure: true, httpOnly: true, sameSite: 'None'});

        // Returnable User Data
        const returnedData = {
            userEmail: validateUser.email, 
            userID: validateUser._id,
            userName: validateUser.firstName + ' ' + validateUser.lastName,
            userPhone: validateUser.phone,
            cart: validateUser.cart,
        };

        return res.status(RouteCode.SUCCESS.statusCode).json(returnedData);
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }

};
const postRequestPasswordReset = async (req, res) => {
    const { userEmail } = req.body;
    try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
        return res.status(404).send('User with this email does not exist.');
      }
  
      // Create a reset token (expires in 15 minutes)
      const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '15m' });
  
      user.resetToken = token;
      await user.save();
  
      await MAILER.sendResetMail(user.email, token);
      return res.status(RouteCode.SUCCESS.statusCode).json({message: 'Reset mail has shared to the registered email!'});
    } catch (err) {
        console.error(err);
        res.status(RouteCode.SERVER_ERROR.statusCode).json({ message: RouteCode.SERVER_ERROR.message })
    }
};
const putResetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
      // Verify token (will throw an error if expired)
      const decoded = jwt.verify(token, JWT_SECRET_KEY);
      
      // Find user by decoded token userId
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'User not found, Try later!'});
      }
  
      // Hash the new password
      user.password = await bcrypt.hash(newPassword.toString(), Number(SALT));
      await user.save();
      return res.status(RouteCode.NOT_FOUND.statusCode).json({message: 'Password has updated successfully!'});
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(RouteCode.CONFLICT.statusCode).json({message: 'Reset link has expired. Please request a new link.'});
      }
      res.status(RouteCode.SERVER_ERROR.statusCode).json({message: 'Invalid or expired token'});
    }
  };
  
  

export default {
    postLogin, getLogout,
    postPublicRegister, postPublicLogin, postRequestPasswordReset, putResetPassword,
}