const ListedItem = require("../model/ListedItem");
const SoldItem = require("../model/SoldItem");
const { catchAsync } = require("../utils/catchAsync");

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"

const getAllListing = async(req, res)=>{
    const items = await ListedItem.find({buyer: NULL_ADDRESS}).sort({ _id: -1 })
    res.send(items)
}

const getSoldItems = async(req,res)=>{
    const itemsSold = await SoldItem.find().sort({ _id: -1 }).limit(10);
    res.send(itemsSold)
}

const addToMarketplace = async (seller, nftAddress, tokenId, price, event)=>{
    try{
        await ListedItem.create({
            itemId: `${nftAddress}${tokenId}`,
            seller,
            nftAddress,
            tokenId: parseInt(tokenId),
            price: price.toString(),
            buyer: NULL_ADDRESS
        })
        console.log("Added to marketPlace")
    } catch(e){
        if(e.code === 11000) {
            await ListedItem.findOneAndUpdate({itemId: `${nftAddress}${tokenId}`}, {buyer: NULL_ADDRESS, seller, price: price.toString()})
            console.log("Added to marketplace")
        }
        else console.log(e)
    }
}

const removeFromMarketplace = async (seller, nftAddress, tokenId, event)=>{
    await ListedItem.findOneAndUpdate({itemId: `${nftAddress}${tokenId}`}, {buyer: DEAD_ADDRESS})
    console.log("Removed listing")
}

const updateItemListing = async(seller, nftAddress, tokenId, price, event)=>{
    await ListedItem.findOneAndUpdate({itemId: `${nftAddress}${tokenId}`}, {price: price.toString()})
    console.log("Updated Listing")
}

const itemSold = async(buyer, nftAddress, tokenId, price, event)=>{
    await ListedItem.findOneAndUpdate({itemId: `${nftAddress}${tokenId}`}, {buyer})
    // await SoldItem.create({
    //     buyer,
    //     nftAddress,
    //     tokenId: parseInt(tokenId),
    //     transactionHash: event.log.transactionHash,
    //     price: price.toString()
    // })
    console.log("Item Sold")
}



module.exports = {
    addToMarketplace,
    removeFromMarketplace,
    updateItemListing,
    itemSold,
    getAllListing,
    getSoldItems
}