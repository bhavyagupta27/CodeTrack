const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(error => console.error("❌ MongoDB Connection Error:", error.message));

app.use("/api/auth", authRoutes);

// Serve frontend static files (same-origin, one link for everything)
const FRONTEND_PATH = path.join(__dirname, "..", "Frontend");
app.use(express.static(FRONTEND_PATH));

app.post("/profile", async (req,res)=>{
  try{
    const user=await User.findOne({email:req.body.email}).select("-password");
    if(!user)return res.status(404).json({success:false,message:"User not found"});
    res.json(user);
  }catch(error){console.error(error);res.status(500).json({success:false,message:"Server Error"});}
});

app.put("/profile", async (req,res)=>{
  try{
    const {email,name,goal}=req.body;
    const user=await User.findOne({email});
    if(!user)return res.status(404).json({success:false,message:"User not found"});
    if(name)user.name=name;if(goal)user.goal=goal;await user.save();
    res.json({success:true,message:"Profile Updated Successfully",user:{name:user.name,email:user.email,goal:user.goal}});
  }catch(error){console.error(error);res.status(500).json({success:false,message:"Server Error"});}
});

app.put("/progress", async (req,res)=>{
  try{
    const user=await User.findOne({email:req.body.email});
    if(!user)return res.status(404).json({success:false,message:"User not found"});
    if(req.body.goals)user.goals=req.body.goals;
    if(req.body.weeklyProgress){
      user.weeklyProgress=req.body.weeklyProgress;
      const totalCompletions=req.body.weeklyProgress.reduce((a,b)=>a+(b||0),0);
      user.rating=1000+totalCompletions*20;
    }
    await user.save();
    res.json({success:true,message:"Progress synced to database!",rating:user.rating});
  }catch(error){console.error(error);res.status(500).json({success:false,message:"Server Error"});}
});

app.get("/api/leetcode/:username",async(req,res)=>{
  try{
    const response=await fetch(`https://alfa-leetcode-api.onrender.com/${req.params.username}/solved`);
    if(!response.ok)throw new Error(`API returned status: ${response.status}`);
    const data=await response.json();
    res.json({status:"success",totalSolved:data.solvedProblem||0});
  }catch(error){res.status(500).json({success:false,message:"Backend failed to fetch LeetCode data"});}
});

app.get("/api/github/:username",async(req,res)=>{
  try{
    const response=await fetch(`https://api.github.com/users/${req.params.username}`,{headers:{"User-Agent":"CodeTrack-App"}});
    if(!response.ok)throw new Error(`GitHub user not found: ${response.status}`);
    const data=await response.json();
    res.json({success:true,publicRepos:data.public_repos||0});
  }catch(error){res.status(500).json({success:false,message:"Failed to fetch GitHub stats"});}
});

app.get("/api/codeforces/:handle",async(req,res)=>{
  try{
    const response=await fetch(`https://codeforces.com/api/user.info?handles=${req.params.handle}`);
    const data=await response.json();
    if(data.status!=="OK")return res.status(404).json({success:false,message:"Codeforces handle not found"});
    const u=data.result[0];
    res.json({
      success:true,
      handle:u.handle,
      rating:u.rating||0,
      maxRating:u.maxRating||0,
      rank:u.rank||"Unrated",
      maxRank:u.maxRank||"Unrated",
      avatar:u.titlePhoto||""
    });
  }catch(error){res.status(500).json({success:false,message:"Failed to fetch Codeforces data"});}
});

app.get("/user-profile",async(req,res)=>{
  try{
    const user=await User.findOne({email:req.query.email}).select("-password");
    if(!user)return res.status(404).json({success:false,message:"User not found"});
    res.json({success:true,user});
  }catch(error){res.status(500).json({success:false,message:error.message});}
});

app.listen(PORT,"0.0.0.0",()=>console.log(`🚀 Server running on port ${PORT}`));
