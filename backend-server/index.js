if(!process.env.PRODUCTION) require("dotenv").config()
const express = require("express")
const app = express()
const ethers = require("ethers")
const mongoose = require("mongoose")
const cors = require("cors");

const contractABI = require('./constants/contractAbi.json');
const contractAddresses = require("./constants/contractAddresses.json");
const { addToMarketplace, removeFromMarketplace, itemSold, updateItemListing, getAllListing, getSoldItems } = require("./controllers/marketplaceListing")
const { query } = require("./utils/query")

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const CHAIN_ID = process.env.CHAIN_ID
RPC_URL= CHAIN_ID === 31337 ? "http://127.0.0.1:8545/" : process.env.SEPOLIA_RPC_URL

const provider = new ethers.JsonRpcProvider(RPC_URL)
const nftMarketplaceAddress = contractAddresses[CHAIN_ID]["NftMarketplace"];
const nftMarketplace = new ethers.Contract(nftMarketplaceAddress, contractABI, provider);

if(CHAIN_ID == 11155111){
    query(nftMarketplace)
}


// Listen to live events
nftMarketplace.on("ItemListed", (event) => {
  try {
    addToMarketplace(event);
  } catch (error) {
    console.log(error);
  }
});

nftMarketplace.on("ItemCancelled", (event) => {
  try {
    removeFromMarketplace(event);
  } catch (error) {
    console.log(error);
  }
});

nftMarketplace.on("ItemBought", (event) => {
  try {
    itemSold(event);
  } catch (error) {
    console.log(error);
  }
});

nftMarketplace.on("UpdatedListing", (event) => {
  try {
    updateItemListing(event);
  } catch (error) {
    console.log(error);
  }
});


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api/listing", getAllListing)
app.get("/api/sold-items", getSoldItems)

// Error Handling middleware
app.use((err, req, res, next) => {
    console.log(err.message);
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).send(message);
  });

const startServer = async()=>{
    await mongoose.connect(MONGODB_URI)
    .then(()=>console.log("Connected to DB Successfully"))
    .catch((error)=>console.log(error));

    app.listen(PORT, ()=>{
        console.log(`Server Started on port ${PORT}`)
    })
}

startServer()