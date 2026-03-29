import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "Enter all the fields" });
        }
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: "User already exist" });
        }
        const salt =await bcrypt.genSalt(10);
        const hasspassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            name: name,
            email: email,
            password: hasspassword
        });
        await newUser.save();
        res.status(200).json({ msg: "user registered successfully" })
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
    
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "Provide credentials" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "user does not exist" });
        }
        const isExist = await bcrypt.compare(password, user.password);
        if (!isExist) {
            return res.status(400).json({ msg: "invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 3600000 // 1 hour
        });
        res.status(200).json({
            msg: "Login Successful",
            user: { id: user._id, name: user.name, email: user.email }
        });
        
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: "Logged out successfully" });
});
export default router;