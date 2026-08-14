const express=require("express");
const userModel=require("../models/user.model.js")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const foodPartner=require("../models/foodPartner.model.js");
const foodPartnerModel = require("../models/foodPartner.model.js");

async function RegisterUser(req,res){
   const {password,email,fullName}=req.body;
    if(await userModel.findOne({email})){
        return res.status(400).json({message:"User already exists"})
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=await userModel.create({
        fullName,
        email,
        password:hashPassword
    });
    const token=jwt.sign({email:user.email}, "secret", {expiresIn:"1h"});
    res.cookie("token",token, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({message:"User registered successfully",user,token});
    
}


async function LoginUser(req,res){
    const {email,password}=req.body;
    const user=await userModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const token=jwt.sign({email:user.email}, "secret", {expiresIn:"1h"});
    res.cookie("token",token, { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({message:"Login successful",user,token});
    
}

async function Logout(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"Logout successful"});
}


async function RegisterFoodPartner(req,res){
   const {password,email,fullName,phone,address,contactName}=req.body;
    if(await foodPartnerModel.findOne({email})){
        return res.status(400).json({message:"User already exists"})
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=await foodPartnerModel.create({
        fullName,
        email,
        password:hashPassword,
        phone,
        address,
        contactName 
    });
     const token=jwt.sign({email:user.email}, "secret", {expiresIn:"1h"});
    res.cookie("token",token, { httpOnly: true, sameSite: 'lax' });
    res.status(201).json({message:"User registered successfully",user,token});
   
}


async function LoginFoodPartner(req,res){
    const {email,password}=req.body;
    const user=await foodPartnerModel.findOne({email});
    if(!user){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).json({message:"Invalid email or password"})
    }
    const token=jwt.sign({email:user.email}, "secret", {expiresIn:"1h"});
    res.cookie("token",token, { httpOnly: true, sameSite: 'lax' });
    res.status(200).json({message:"Login successful",user,token});
    
}

async function LogoutFoodPartner(req,res){
    res.clearCookie("token");
    res.status(200).json({message:"Logout successful"});
}

module.exports={LoginUser,RegisterUser,Logout,RegisterFoodPartner,LoginFoodPartner,LogoutFoodPartner};