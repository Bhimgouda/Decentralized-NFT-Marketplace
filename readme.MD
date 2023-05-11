# Decentralized NFT marketplace Backend Contract

    1. `listItem`: List NFT's on the marketplace
    2. `buyItem`: Buy the NFT's
    3. `cancelItem`: Cancel a listing
    4. `UpdateListing`: Update Price
    5. `withdrawProceeds`: Withdraw payment for my bought NFT's

# Centralized Frontend

    It is a centralized frontend as it makes api calls to a centralized server to get the required data

    1. Home page
        1.1 Show recently listed NFT's
            1.1.1 If you own the NFT, you can update the listing
            1.1.2 If not, you can buy the nft from listing
    2. Sell Page
        2.1 You can list your NFT on the marketplace
        2.2 And withdraw proceeds
        2.3 And can also cancel the listing

# Backend servers

    1. It is a NodeJS server that listens to the events fired by our contract on specific chain using Ethers web3-client library
    2. Makes changes to the MONGODB according to the event data
    3. Responds back to frontend with the required indexed data

# The Graph decentralized frontend

    It is decentralized frontend as it utilizes the graph protocol instead of a centralized server

    1. The graph protocol indexes the events in decentralized manner
    2. Th frontend reads from the Graph using their set of API's
