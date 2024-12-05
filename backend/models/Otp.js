const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type: String,
        required: true,
    },
    expiresAt: Date
},{timestamps:true})

const Otp = mongoose.model('Otp',OtpSchema)

module.exports = Otp;
