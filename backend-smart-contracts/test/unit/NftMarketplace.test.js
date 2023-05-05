const {assert, expect} = require("chai");
const {network, deployments, ethers, getNamedAccounts} = require("hardhat");
const { developmentChains } = require("../../helper-hardhat.config");

!developmentChains.includes(network.name) ? describe.skip : describe("NFt Marketplace Tests", function(){
    let nftMarketPlaceContract, basicNft, deployer, user

    const PRICE = ethers.utils.parseEther("0.1")
    const TOKEN_ID = 0

    beforeEach(async function(){
        deployer =  (await getNamedAccounts()).deployer
        user = (await getNamedAccounts()).user

        // Deploying All contracts
        await deployments.fixture(["all"])

        nftMarketPlaceContract = await ethers.getContract("NftMarketplace")
        basicNft = await ethers.getContract("BasicNFT")

        // Minting a basic nft and approving tokenId 0 to nftMarketPlaceContract
        await basicNft.mintNft();
        await basicNft.approve(nftMarketPlaceContract.address, TOKEN_ID)
    })
    
    it("emits an event after listing an item", async function(){
        expect(await nftMarketPlaceContract.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit("ItemListed")
    })

    it("check if item doesn't get relisted", async function(){
        await nftMarketPlaceContract.listItem(basicNft.address, TOKEN_ID, PRICE)

        const error = `'NftMarketplace__AlreadyListed("${basicNft.address}", ${TOKEN_ID})'`

        await expect(nftMarketPlaceContract.listItem(basicNft.address, TOKEN_ID, PRICE)).to.be.revertedWith(error);
    })

    it("emits an event after buying item", async function(){
        await nftMarketPlaceContract.listItem(basicNft.address, TOKEN_ID, PRICE)
        nftMarketPlace= nftMarketPlaceContract.connect(user)
        expect(await nftMarketPlaceContract.buyItem(basicNft.address, TOKEN_ID, {value: PRICE})).to.emit("ItemBought")
    })
})