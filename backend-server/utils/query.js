const { processAddToMarketplace, processRemoveFromMarketplace, processItemSold, processUpdateItemListing } = require("../controllers/querying")

exports.query = async (nftMarketplace)=>{
        try {
          // Step 1: Specify the block number from which you want to retrieve past events
          const fromBlockNumber = 3456655;
          // Step 2: Retrieve past events
          const pastItemListedEvents = await nftMarketplace.queryFilter(
            "ItemListed",
            fromBlockNumber
          );
          const pastItemCancelledEvents = await nftMarketplace.queryFilter(
            "ItemCancelled",
            fromBlockNumber
          );
          const pastItemBoughtEvents = await nftMarketplace.queryFilter(
            "ItemBought",
            fromBlockNumber
          );
          const pastUpdatedListingEvents = await nftMarketplace.queryFilter(
            "UpdatedListing",
            fromBlockNumber
          );
      
          // Combine and sort past events based on block number or timestamp
          const allPastEvents = [
            ...pastItemListedEvents,
            ...pastItemCancelledEvents,
            ...pastItemBoughtEvents,
            ...pastUpdatedListingEvents,
          ];
          allPastEvents.sort((a, b) => a.blockNumber - b.blockNumber); // Sort events by block number
          console.log("Sorted...");
      
          // Step 2: Process past events in chronological order
          for (contractEvent of allPastEvents) {
            try {
              if (contractEvent.fragment.name === "ItemListed") {
                await processAddToMarketplace(contractEvent);
              } else if (contractEvent.fragment.name === "ItemCancelled") {
                await processRemoveFromMarketplace(contractEvent);
              } else if (contractEvent.fragment.name === "ItemBought") {
                await processItemSold(contractEvent);
              } else if (contractEvent.fragment.name === "UpdatedListing") {
                await processUpdateItemListing(contractEvent);
              }
            } catch (error) {
              console.log(error);
            }
          }
      
          console.log("Event querying done");
        } catch (error) {
          console.log(error);
        }
}