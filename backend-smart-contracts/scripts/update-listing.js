const {ethers} = require("hardhat")

const TOKEN_ID = 2
const NEW_PRICE = ethers.utils.parseEther("0.21")

async function UpdateListing(){
    const basicNft = await ethers.getContract("BasicNFT");
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const UpdateTx = await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, NEW_PRICE)
    await UpdateTx.wait(1)

    console.log('Item listing has been Updated')
}


UpdateListing()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })