const mongoose = require("mongoose")
const { Schema } =  mongoose

const soldItemSchema = new Schema({
    seller: String,
    nftAddress: String,
    tokenId: Number,
    price: Number,
    buyer: String,
    transactionHash: {
        type: String,
        unique: true
    }
}, { timestamps: true })

const SoldItem = mongoose.model("SoldItem", soldItemSchema)

module.exports = SoldItem