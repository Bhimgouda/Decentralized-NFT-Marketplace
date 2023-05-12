const ListedItem = require("../model/ListedItem")
const SoldItem = require("../model/SoldItem")

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"

const processAddToMarketplace = async (event)=>{    
    const {args} = event

    try{
        await ListedItem.create({
            itemId: `${args[1]}${args[2]}`,
            seller: args[0],
            nftAddress: args[1],
            tokenId: parseInt(args[2]),
            price: args[3].toString(),
            buyer: NULL_ADDRESS
        })
        console.log("Added to marketplace")
    } catch(e){
        if(e.code === 11000) {
            await ListedItem.findOneAndUpdate({itemId: `${args[1]}${args[2]}`}, {buyer: NULL_ADDRESS, seller: args[0], price: args[3].toString()})
            console.log("Added to marketplace")
        }
        else console.log(e)
    }
}

const processRemoveFromMarketplace = async (event)=>{
    const {args} = event
    await ListedItem.findOneAndUpdate({itemId: `${args[1]}${args[2]}`}, {buyer: DEAD_ADDRESS})
    console.log("Removed Listing")
}

const processUpdateItemListing = async(event)=>{
    const {args} = event
    await ListedItem.findOneAndUpdate({itemId: `${args[1]}${args[2]}`}, {price: args[3].toString()})
    console.log("Updated Listing")
}

const processItemSold = async(event)=>{
    const {args} = event
    await ListedItem.findOneAndUpdate({itemId: `${args[1]}${args[2]}`}, {buyer: args[0]})
    await SoldItem.create({
        buyer: args[0],
        nftAddress: args[1],
        tokenId: parseInt(args[2]),
        transactionHash: event.transactionHash,
        price: args[3].toString()
    })
    console.log("Item Sold")
}

module.exports = {
    processAddToMarketplace,
    processRemoveFromMarketplace,
    processUpdateItemListing,
    processItemSold,
}