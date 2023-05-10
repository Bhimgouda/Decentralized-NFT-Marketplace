import { Form, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/contractAbi.json"
import nftAbi from "../constants/Nft-erc721-abi.json"
import nftMarketplacAddresses from "../constants/contractAddresses.json"
import { useWeb3Contract } from "react-moralis";
import {ethers} from "ethers"

const CHAIN_ID = 31337
const NFT_MARKETPLACE_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]

const SellNft = () => {
    const {runContractFunction} = useWeb3Contract()
    const dispatch = useNotification()

    const approveAndList = async (data)=>{
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: NFT_MARKETPLACE_ADDRESS,
                tokenId: tokenId,
            },
        }

        await runContractFunction({
                params: approveOptions,
                onSuccess: ()=>handleApproveSuccess(nftAddress, tokenId, price),
                onError: (error)=>{
                    console.log(error)
                }
        })
    }

    const handleApproveSuccess = async(nftAddress, tokenId, price)=>{
        console.log("Ok! Now time to List")

        const listOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: NFT_MARKETPLACE_ADDRESS,
            functionName: "listItem",
            params: {
                nftAddress,
                tokenId,
                price
            }
        }

        await runContractFunction({
            params: listOptions,
            onSuccess: ()=> handleListSuccess(),
            onError: (error)=>{
                console.log(error)
            }
        })
    }

    const handleListSuccess = async ()=>{
        dispatch({
            type: "success",
            message: "NFT listing",
            title: "NFT listed",
            position: "topR"
        })
    }

    return ( 
        <div>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "NFT Address",
                        type: "text",
                        inputwidth: "50%",
                        value: "",
                        key: "nftAddress"
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: 'tokenId'
                    },
                    {
                        name: "Price (in ETH)",
                        type: "number",
                        value: "",
                        key: "price"
                    },
                ]}
                title="Sell your NFT!"
                id="Main Form"
            />
        </div>
     );
}
 
export default SellNft;