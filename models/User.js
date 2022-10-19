const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    isVerifyOtp:{type:Boolean,default:false},
    username: {type: String, required: true},
    password: {type: String, required: true},
    phoneNumber:{type:Number,require:true},
    avatarURL:{type: String, required: true},
    friends: {type: [],require:false},
    nicknamez:{type: String, required: false},
})

module.exports = mongoose.model('User',UserSchema);