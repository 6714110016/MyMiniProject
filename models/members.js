const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const MemberSchema = new mongoose.Schema({

    name:{ 
        type:String, 
        required:true 
    },

    email:{ 
        type:String, 
        required:true, 
        unique:true 
    },

    phone:{ 
        type:String, 
        required:true 
    },

    password:{ 
        type:String, 
        required:true 
    },

    role:{
        type:String,
        enum:["owner","employee","customer"],
        default:"customer"
    }

})

MemberSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password , this.password)
}

module.exports = mongoose.model("member" , MemberSchema)