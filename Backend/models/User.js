const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  email:{type:String,required:true,unique:true,trim:true,lowercase:true},
  password:{type:String,required:true},
  name:{type:String,default:"CodeTrack User"},
  questionsSolved:{type:Number,default:0},
  target:{type:Number,default:300},
  githubCommits:{type:Number,default:0},
  dayStreak:{type:Number,default:0},
  goal:{type:String,default:"Full Stack Developer"},
  goals:{type:Array,default:[
    {text:"DSA Practice",completed:false},
    {text:"Backend Learning",completed:false},
    {text:"GSSoC",completed:false},
    {text:"Project Development",completed:false}
  ]},
  weeklyProgress:{type:[Number],default:[0,0,0,0,0,0,0]},
  rating:{type:Number,default:1000},
  codeforcesHandle:{type:String,default:""},
  githubUsername:{type:String,default:""},
  leetcodeUsername:{type:String,default:""}
},{timestamps:true});
module.exports=mongoose.model("User",userSchema);
