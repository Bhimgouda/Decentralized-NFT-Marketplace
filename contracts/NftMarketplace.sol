// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract NftMarketplace {

}

// 1. `listItem`: List NFT's on the marketplace
    // 1.1 There are 2 ways to do this
        // 1.1.1 Send the NFT to the marketplace contract(Transfer -> Contract "hold" the NFT)
        // 1.1.2 Owners can still hold their NFT, and give the marketplace approval to sell the NFT for them

// 2. `buyItem`: Buy the NFT's
// 3. `cancelItem`: Cancel a listing
// 4. `UpdateListing`: Update Price
// 5. `withdrawProceeds`: Withdraw payment for my bought NFT's