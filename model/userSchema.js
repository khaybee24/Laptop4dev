const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {type: String ,required: true},
    lastName: {type: String ,required: true},
    email: {type: String ,required: true,unique: true},
    phoneNumber: {type: String},
    reasonForLaptop: {type: String},
    role: {type: String, default: "user", enum: ["admin", "user"]},
    password: {type: String}
   
},
{timestamps: true,
versionkey:false,
});

module.exports = mongoose.model('User', userSchema);