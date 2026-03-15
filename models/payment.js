const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    createdAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("payment", paymentSchema)