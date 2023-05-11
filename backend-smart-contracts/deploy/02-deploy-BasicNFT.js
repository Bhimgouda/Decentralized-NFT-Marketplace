const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat.config")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    if(developmentChains.includes(network.name)){
        log("----------------------------------------")
        const args = []
    
        const basicNFT = await deploy("BasicNFT", {
            from: deployer,
            args,
            log: true,
            waitConfirmations: network.config.blockConfirmations || 1,
        })
    
        // Verify the deployment
        if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
            log("verifying...")
            await verify(basicNFT.address, args)
        }
    }
}

module.exports.tags = ["all", "basicnft", "main"]
