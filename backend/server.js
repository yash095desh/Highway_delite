const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { error } = require("console");
require("dotenv").config();
const nodemailer = require("nodemailer")
const bcrypt = require("bcrypt");
const Otp = require("./models/Otp")
const User = require("./models/User")
const Note = require("./models/Note")
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

let transporter = nodemailer.createTransport({
    service : 'gmail',
    secure : true,
    port : 465,
    auth :{
        user: "yashdesh095@gmail.com",
        pass : "ilcn ymgz zpbe akjr"
    }
})

// auth apis 
app.post("/register",async(req,res)=>{
    const {dateOfBirth,email,name}= req.body;
    try {
        if(!dateOfBirth || !email || !name){
            throw new Error("All Feilds Required")
        }
        const user = await User.findOne({email})
        if(user){
            throw new Error("User Already Exist")
        }
        const newUser = new User({
            email:email,
            dateOfBirth:dateOfBirth,
            name:name
        })
         await newUser.save();
        console.log(newUser)
        const token = await generateToken(newUser._id)
        res.status(200).json({message:"User has successfully created",user:newUser,token})     
    } catch (error) {
        console.log("SignUp Error:",error.message)
        res.status(500).json({message:error.message,error:"SignUp Error"})
    }

})

app.post("/login",async(req,res)=>{
    try {
        const {email} = req.body;
        if(!email){
            throw new Error("Please Provide Email")
        }
        const user = await User.findOne({email})
        if(!user){
            throw new Error("User not exist")
        }
        const token = await generateToken(user._id)
        res.status(200).json({message:"User SignIn successfully",user,token})

    } catch (error) {
        console.log("Login Error",error.message)
        res.status(500).json({error:"Login Error",message:error.message})
    }
})

app.post("/sendOtpVerificationEmail",async(req,res) =>{
    const {email} = req.body;
    console.log(req.body) 
    if(!email){
      return res.status(404).json({message:"Please Provide email"})
    }
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        console.log(otp)
        const mailOptions = {
            from:"yashdesh095@gmail.com",
            to: email ,
            subject: "Verify Your Email",
            html: `<p>Enter <b>${otp}</b>in the app to verify your email address </p> <p>This code expires in 2 minutes </p>`
        }

        const saltRounds = 10;
        const hashedOtp = await bcrypt.hash(otp,saltRounds)
        const newOtp =  new Otp({
            email : email,
            otp : hashedOtp,
            expiresAt : Date.now() + 120000,
        })
        await newOtp.save();
        console.log(newOtp)
        await transporter.sendMail(mailOptions)
        res.status(200).json({message:"Verification otp email sent", data:{email:email}})
    } catch (error) {
        console.log("Error while genrating otp:",error.message)
        res.status(500).json({message:error.message})
    }
})

app.post("/verifyOtp", async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!otp || !email) {
            throw new Error("Empty OTP or email not allowed");
        }


        const OtpRecords = await Otp.find({ email });
        if (OtpRecords.length <= 0) {
            throw new Error("Account records do not exist or user has been verified already");
        }

        const { expiresAt, otp: hashedOtp } = OtpRecords[0];


        if (expiresAt < Date.now()) {
            await Otp.deleteMany({ email });
            throw new Error("OTP has expired, please request again");
        }


        const validateOtp = await bcrypt.compare(otp, hashedOtp);
        console.log("Validation result:", validateOtp);

        if (!validateOtp) {
            throw new Error("Invalid OTP");
        }


        // Delete OTP records after successful verification
        await Otp.deleteMany({ email });

        res.status(200).json({
            status: "VERIFIED",
            message: "User email has been verified successfully",
        });
    } catch (error) {
        console.log("Error in verifying OTP:", error.message);
        res.status(500).json({ message: error.message });
    }
});

const generateToken = (userId) => {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET, 
        { expiresIn: '3h' } 
    );
    return token;
};

// middleware to check jwt token
const verifyToken  = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        const userId = decoded.userId;
        const objectId = new mongoose.Types.ObjectId(userId);
        req.user = objectId; 
        next(); 
    });
}

//Note api's

app.get('/getUser',verifyToken,async(req,res)=>{
    try {
        const userId = req.user;
        const user = await User.findOne({_id:userId});
        if(!user){
            throw new Error("User Not Found")
        }
        console.log("User:",user)
        res.status(200).json({message:"User Found",user})

    } catch (error) {
        console.log("Error while getting user",error.message)
        res.status(500).json({message:"Error while getting user",error:error.message})
    }
})

app.post('/create',verifyToken,async(req,res)=>{
    try {
    const {content} = req.body;
    const userId = req.user;
    if(!content){
        throw new Error('Content Not Found')
    }
    const note = new Note({
        user:userId,
        content:content
    })
    await note.save()

    res.status(200).json({message:"Note Created",note})
        
    } catch (error) {
        console.log('Error in creating Note',error.message)
        res.status(500).json({message:"Error while creating Note",error:error.message})
    }
})

app.delete('/deleteNote/:id',verifyToken,async(req,res)=>{
    const { id } = req.params;

  try {
    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully", note: deletedNote });
  } catch (error) {
    res.status(500).json({ message: "Error deleting note", error: error.message });
  }
    
})

app.get('/getAllNotes',verifyToken,async(req,res)=>{
    try {
        const userId = req.user;
        const notes = await Note.find({user:userId}) 
        res.status(200).json({message:"Fetched All Notes",notes})
    } catch (error) {
        console.log("Error while fetching notes:",error.message)
        res.status(500).json({message:"Error while fetching notes",error:error.message})
    }
})


mongoose
  .connect(process.env.MONGOURI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}..`);
});
