const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:4,
        maxLength:20

    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error("invalid email..")
        }
        
    },
    password:{
        type:String,
        require:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
           if(!["male","female","others"].includes(value)) throw new Error("invalid gender");
        }
    },
    photoUrl:{
        type:String,
        default:"https://png.pngtree.com/png-clipart/20231019/original/pngtree-user-profile-avatar-png-image_13369988.png"
    },
    about:{
        type:String,
        default:"Hey there ! I am using DEVTINDER"
    },
    skills:{
        type:[String],
        validate(value){
          if(value.length > 10)throw new Error("You are typing to add skills more than 10...")
        }
    }
},{
    timestamps:true
})

module.exports = mongoose.model("User",userSchema);
 