const {network, ethers} = require("hardhat");

const PRICE = ethers.utils.parseEther("0.1")

async function mintAndList() {
    const basicNft = await ethers.getContract("BasicNFT") 
    const nftMarketplace = await ethers.getContract("NftMarketplace")

    const mintTx = await basicNft.mintNft()
    const mintTxReceipt = await mintTx.wait(1)
    const tokenId = mintTxReceipt.events[0].args.tokenId

    console.log("Giving approval.....");
    const approveTx = await basicNft.approve(nftMarketplace.address, tokenId)
    await approveTx.wait(1)
    
    console.log("Listing Nft...")
    const listingTx = await nftMarketplace.listItem(basicNft.address, tokenId, PRICE)
    await listingTx.wait(1)

    console.log("NFT is listed!")

    
}

mintAndList()
    .then(()=>process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })