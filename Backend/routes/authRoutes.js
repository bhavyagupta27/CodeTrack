const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

router.post("/register",async(req,res)=>{
  try{
    const {email,password,name,goal}=req.body;
    if(!email||!password)return res.status(400).json({success:false,message:"Email and password are required"});
    const exists=await User.findOne({email});
    if(exists)return res.status(409).json({success:false,message:"User already exists"});
    const hash=await bcrypt.hash(password,10);
    const user=await User.create({email,password:hash,name:name||"CodeTrack User",goal:goal||"Full Stack Developer"});
    res.status(201).json({success:true,message:"Registration Successful",user:{id:user._id,name:user.name,email:user.email,goal:user.goal}});
  }catch(error){console.error(error);res.status(500).json({success:false,message:"Server Error"});}
});

router.post("/login",async(req,res)=>{
  try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user)return res.json({success:false,message:"Invalid Credentials"});
    const valid=await bcrypt.compare(password,user.password);
    if(!valid)return res.json({success:false,message:"Invalid Credentials"});
    res.json({success:true,message:"Login Successful",user:{id:user._id,name:user.name,email:user.email,goal:user.goal}});
  }catch(error){console.error(error);res.status(500).json({success:false,message:"Server Error"});}
});

module.exports=router;
