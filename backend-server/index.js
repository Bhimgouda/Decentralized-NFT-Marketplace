if(!process.env.PRODUCTION) require("dotenv").config()
const express = require("express")
const app = express()
const ethers = require("ethers")
const { default: mongoose } = require("mongoose")
const ListedItem = require("./model/ListedItem")
// const contractABI = require('./constants/nft-marketplace-abi.json');
const contractAddresses = require("./constants/contractAddresses.json");



RPC_URL="http://127.0.0.1:8545/"
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const CHAIN_ID = process.env.CHAIN_ID

const provider = new ethers.JsonRpcProvider(RPC_URL)

const nftMarketplaceAddress = contractAddresses[CHAIN_ID]["NftMarketplace"];

console.log(nftMarketplaceAddress)

// const nftMarketplace = new ethers.Contract(contractAddress, contractABI, provider);

// nftMarketplace.on("ItemListed", async (seller, nftAddress, tokenId, price)=>{
//         await ListedItem.create({
//         seller,
//         nftAddress,
//         tokenId: parseInt(tokenId),
//         price: parseInt(price)
//     })
// })

// const startServer = async()=>{
//     await mongoose.connect(MONGODB_URI)
//     .then(()=>console.log("Connected to DB Successfully"))
//     .catch((error)=>console.log(error));

//     app.listen(PORT, ()=>{
//         console.log(`Server Started on port ${PORT}`)
//     })
// }

// startServer()