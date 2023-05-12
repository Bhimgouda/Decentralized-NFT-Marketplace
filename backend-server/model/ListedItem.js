const mongoose = require("mongoose")
const { Schema } =  mongoose

const listedItemSchema = new Schema({
    seller: String,
    nftAddress: String,
    tokenId: Number,
    price: Number,
    buyer: String,
    itemId: {
        type: String,
        unique: true
    }
},{ timestamps: true })

const ListedItem = mongoose.model("ListedItem", listedItemSchema)

module.exports = ListedItem