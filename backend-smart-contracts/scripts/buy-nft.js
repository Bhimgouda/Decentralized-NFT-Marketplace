const {ethers} = require("hardhat")

const TOKEN_ID = 1

async function buyItem(){
    const basicNft = await ethers.getContract("BasicNFT");
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
    const PRICE = listing.price.toString()

    const buyTx = await nftMarketplace.buyItem(basicNft.address, TOKEN_ID, {value: PRICE})
    await buyTx.wait(1)

    console.log('Bought Nft')
}


buyItem()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })