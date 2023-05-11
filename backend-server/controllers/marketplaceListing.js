const ListedItem = require("../model/ListedItem");
const SoldItem = require("../model/SoldItem");
const { catchAsync } = require("../utils/catchAsync");

const getAllListing = async(req, res)=>{
    const items = await ListedItem.find()
    res.send(items)
}

const getSoldItems = async (req,res)=>{
    const soldItems = await SoldItem.find()
    res.send(soldItems)
}

const addToMarketplace = async (seller, nftAddress, tokenId, price, event)=>{
    console.log(event.log.transactionHash)
    try{
        await ListedItem.create({
            seller,
            nftAddress,
            tokenId: parseInt(tokenId),
            price: price.toString(),
            transactionHash: event.log.transactionHash
        })
        console.log("Added to marketPlace")
    } catch(e){
        if(e.code === 11000) console.log("Duplicate event")
        else console.log(e)
    }
}

const removeFromMarketplace = async (seller, nftAddress, tokenId, event)=>{
    tokenId = parseInt(tokenId)
    await ListedItem.findOneAndDelete({nftAddress, tokenId});
    console.log("Removed listing")
}

const updateItemListing = async(seller, nftAddress, tokenId, price, event)=>{
    tokenId = parseInt(tokenId)
    await ListedItem.findOneAndUpdate({nftAddress, tokenId}, {price: price.toString()})
    console.log("Updated Listing")
}

const itemSold = async(buyer, nftAddress, tokenId, price, event)=>{
    try{
        await SoldItem.create({
            buyer,
            nftAddress,
            tokenId: parseInt(tokenId),
            price: price.toString(),
            transactionHash: event.log.transactionHash
        })
        await removeFromMarketplace("", nftAddress, tokenId)
        console.log("Item Sold")
    } catch(e){
        if(e.code === 11000) console.log("Duplicate event")
        else console.log(e)
    }
}



module.exports = {
    addToMarketplace,
    removeFromMarketplace,
    updateItemListing,
    itemSold,
    getAllListing,
    getSoldItems
}