const {network, ethers} = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")
const verify = require("../utils/verify")

module.exports = async({deployments, getNamedAccounts}) =>{
    const {log, deploy} = deployments
    const {deployer} = await getNamedAccounts()

    log("----------------------------------------------")

    const args = [] 

    const nftMarketplace = await deploy("NftMarketplace", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })


    // Verify the deployment
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("Verifying...")
        await verify(nftMarketplace.address, args);
    }
    log("--------------------------------------")
}

module.exports.tags = ['all', 'nftmarketplace'];

