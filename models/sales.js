const mongoose = require("mongoose");

const SaleSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },

    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "member"
    },

    quantity: {
        type: Number,
        required: true,
        min: 1
    },

    totalPrice: {
        type: Number,
        required: true
    }

}, {
    timestamps: true   // สร้าง createdAt และ updatedAt อัตโนมัติ
});

module.exports = mongoose.model("Sale", SaleSchema);