
import jwt from 'jsonwebtoken';
import { userModel } from './../../../db/models/user.model.js';
import bcrypt from 'bcrypt';
import { loginValidation, registerValidation } from '../../utils/userValidaton.js';
import { sendEmail } from '../../utils/email.js';

//~ Register User 
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  try {
    const { error } = registerValidation.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const existingUser = await userModel.findOne({ email }, {});
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(1000 + Math.random() * 9000);
    const newUser = await userModel.create({ username, email, password: hashedPassword, OTP: otp });
    const subject = 'OTP for Registration';
    const html = `<h1>Your OTP for registration is  ${otp} .</h1>`;
    await sendEmail(email, subject, html);
    res.status(201).json({ message: 'User registered successfully', newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

//~ Verify Email 
export const verifyOTP = async (req, res,next) => {
  const { email, otp } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }
    if (user.OTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    try {
      const result = await userModel.updateOne(
        { email },
        { $set: { isVerified: true, OTP: null } }
      );
      if (result.nModified === 0) {
        return res.status(400).json({ message: 'OTP verification failed. Please try again.' });
      }
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (updateError) {
      console.error('Error during user update:', updateError);
      res.status(500).json({ message: 'Failed to update user verification status', error: updateError });
    }
  } catch (findError) {
    console.error('Error finding user:', findError);
    res.status(500).json({ message: 'Server error during verification process', error: findError });
  }
};

//~ Login User 
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { error } = loginValidation.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await userModel.findOne({ email });
    if (user.isVerified == false) {
      return res.status(400).json({ message: 'Please Verify Your email to login' });
    }
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Email or password' });
    }
    const token = jwt.sign({
      userId: user._id,
      email,
      username: user.username
    }, "AhmedSecretKey", {
      expiresIn: '1h'
    })
    res.status(201).json({ message: 'User logged successfully', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

