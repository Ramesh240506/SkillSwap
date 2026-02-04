import { Request, Response } from "express";
import { User } from "../models/User.modal";
import { comparePassword, hashPassword } from "../utils/hash";
import { access } from "node:fs";
import { generateAccessToken } from "../utils/jwt";

export const registerUser = async (req:Request, res:Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = new User({
        name,
        email,
        password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
}

export const loginUser = async (req:Request, res:Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, user.password);
    if(!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken =generateAccessToken(user._id.toString());

    res.status(200).json({ accessToken,user:{ _id: user._id, name: user.name, email: user.email } });
}

