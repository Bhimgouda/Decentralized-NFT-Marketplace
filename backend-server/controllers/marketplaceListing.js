const ListedItem = require("../model/ListedItem");
const SoldItem = require("../model/SoldItem");

const getAllListing = async(req, res)=>{
    const items = await ListedItem.find()
    res.send(items)
}

const addToMarketplace = async (seller, nftAddress, tokenId, price, event)=>{
    console.log(event)
    console.log("Add to marketPlace")
    await ListedItem.create({
        seller,
        nftAddress,
        tokenId: parseInt(tokenId),
        price: price.toString(),
    })
}

const removeFromMarketplace = async (seller, nftAddress, tokenId, event)=>{
    console.log(event)
    console.log("Remove listing")
    tokenId = parseInt(tokenId)
    await ListedItem.findOneAndDelete({nftAddress, tokenId});
}

const updateItemListing = async(seller, nftAddress, tokenId, price, event)=>{
    console.log(event)
    console.log("Update Listing")
    tokenId = parseInt(tokenId)
    await ListedItem.findOneAndUpdate({nftAddress, tokenId}, {price: price.toString()})
}

const itemSold = async(buyer, nftAddress, tokenId, price, event)=>{
    console.log(event)
    console.log("Item Sold")
    await SoldItem.create({
        buyer,
        nftAddress,
        tokenId: parseInt(tokenId),
        price: price.toString()
    })
    await removeFromMarketplace("", nftAddress, tokenId)
}

module.exports = {
    addToMarketplace,
    removeFromMarketplace,
    updateItemListing,
    itemSold,
    getAllListing
}