const {ethers, network} = require("hardhat")
const fs = require("fs")

module.exports = async function () {
    if(process.env.UPDATE_CONTRACT_DATA) {
        console.log("Updating abi's and addresses in required places>>>>>>>")
        const nftMarketplace = await ethers.getContract("NftMarketplace")
        await updateAbi(nftMarketplace)
        await updateContractAddresses(nftMarketplace)
        console.log("Updated abi's and addresses.........")
    }
}

const ADDRESSES_FILES = ["../backend-server/constants/contractAddresses.json", "../moralis-frontend/constants/contractAddresses.json"]
const ABI_FILES = ["../backend-server/constants/contractAbi.json", "../moralis-frontend/constants/contractAbi.json"]

async function updateContractAddresses(nftMarketplace){
    
    const chainId = network.config.chainId.toString()
    
    const contractAddresses = JSON.parse(fs.readFileSync(ADDRESSES_FILES[0], "utf8"))
    
    if(contractAddresses[chainId]){
        contractAddresses[chainId]["NftMarketplace"] = nftMarketplace.address
    }
    else {
        contractAddresses[chainId] = {
            NftMarketplace: nftMarketplace.address
        }
    }
    
    ADDRESSES_FILES.forEach(FILE=>{
    fs.writeFileSync(FILE, JSON.stringify(contractAddresses))
    })
}

async function updateAbi(nftMarketplace) {
    // Getting the abi
    const abi = nftMarketplace.interface.format(ethers.utils.FormatTypes.json)

    // Writing the new abi to the file
    ABI_FILES.forEach(FILE=>fs.writeFileSync(FILE, abi))
}

module.exports.tags = ["all", "update contract data"]