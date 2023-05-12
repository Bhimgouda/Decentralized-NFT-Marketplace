if(!process.env.PRODUCTION) require("dotenv").config()
const express = require("express")
const app = express()
const ethers = require("ethers")
const mongoose = require("mongoose")
const cors = require("cors");

const contractABI = require('./constants/contractAbi.json');
const contractAddresses = require("./constants/contractAddresses.json");
const { addToMarketplace, removeFromMarketplace, itemSold, updateItemListing, getAllListing, getSoldItems } = require("./controllers/marketplaceListing")
const { processAddToMarketplace, processRemoveFromMarketplace, processItemSold, processUpdateItemListing } = require("./controllers/querying")

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const CHAIN_ID = process.env.CHAIN_ID
RPC_URL= CHAIN_ID === 31337 ? "http://127.0.0.1:8545/" : process.env.SEPOLIA_RPC_URL

const provider = new ethers.JsonRpcProvider(RPC_URL)
const nftMarketplaceAddress = contractAddresses[CHAIN_ID]["NftMarketplace"];
const nftMarketplace = new ethers.Contract(nftMarketplaceAddress, contractABI, provider);

if(CHAIN_ID == 11155111){
    query()
}

async function query(){
    // Step 1: Specify the block number from which you want to retrieve past events
    const fromBlockNumber = 3456655;
    // Step 2: Retrieve past events
    const pastItemListedEvents = await nftMarketplace.queryFilter("ItemListed", fromBlockNumber);
    const pastItemCancelledEvents = await nftMarketplace.queryFilter("ItemCancelled", fromBlockNumber);
    const pastItemBoughtEvents = await nftMarketplace.queryFilter("ItemBought", fromBlockNumber);
    const pastUpdatedListingEvents = await nftMarketplace.queryFilter("UpdatedListing", fromBlockNumber);


    // Combine and sort past events based on block number or timestamp
    const allPastEvents = [
    ...pastItemListedEvents,
    ...pastItemCancelledEvents,
    ...pastItemBoughtEvents,
    ...pastUpdatedListingEvents,
  ];  
  allPastEvents.sort((a, b) => a.blockNumber - b.blockNumber); // Sort events by block number
  console.log('Sorted...')

  // Step 2: Process past events in chronological order
  for(contractEvent of allPastEvents){
        if (contractEvent.fragment.name === "ItemListed") {
      await processAddToMarketplace(contractEvent);
    } else if (contractEvent.fragment.name === "ItemCancelled") {
      await processRemoveFromMarketplace(contractEvent);
    } else if (contractEvent.fragment.name === "ItemBought") {
      await processItemSold(contractEvent);
    } else if (contractEvent.fragment.name === "UpdatedListing") {
      await processUpdateItemListing(contractEvent);
    }
  }

  console.log("Event queerying done")
}


// Listen to live events
nftMarketplace.on("ItemListed", addToMarketplace)
nftMarketplace.on("ItemCancelled", removeFromMarketplace)
nftMarketplace.on("ItemBought", itemSold)
nftMarketplace.on("UpdatedListing", updateItemListing)

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