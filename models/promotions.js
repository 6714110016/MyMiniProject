const mongoose = require("mongoose")

const promotionSchema = mongoose.Schema({

    name:{
        type:String,
        required:true
    },

    discount:{
        type:Number,
        required:true
    }

})

module.exports = mongoose.model("Promotion",promotionSchema)