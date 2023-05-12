const mongoose = require("mongoose")
const { Schema } =  mongoose

const soldItemSchema = new Schema({
    transactionHash: String,
    nftAddress: String,
    tokenId: Number,
    price: Number,
    buyer: String
}, { timestamps: true })

const SoldItem = mongoose.model("SoldItem", soldItemSchema)

module.exports = SoldItem