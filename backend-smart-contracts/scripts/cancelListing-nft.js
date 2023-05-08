const {ethers} = require("hardhat")

const TOKEN_ID = 0

async function cancelListing(){
    const basicNft = await ethers.getContract("BasicNFT");
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const cancelTx = await nftMarketplace.cancelItem(basicNft.address, TOKEN_ID)
    await cancelTx.wait(1)

    console.log('Item listing has been cancelled')
}


cancelListing()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })