import { Form, useNotification } from "web3uikit";
import nftMarketplaceAbi from "../constants/contractAbi.json"
import nftAbi from "../constants/Nft-erc721-abi.json"
import nftMarketplacAddresses from "../constants/contractAddresses.json"
import { useWeb3Contract } from "react-moralis";
import {ethers} from "ethers"
import { useRouter } from 'next/router';

const CHAIN_ID = 11155111
const NFT_MARKETPLACE_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]

const SellNft = () => {
    const {runContractFunction} = useWeb3Contract()
    const dispatch = useNotification()
    const router = useRouter()

    const approveAndList = async (data)=>{
        console.log("Approving...")
        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

        dispatch({
            type: "info",
            message: "Waiting for the approval",
            title: "Waiting for Approval",
            position: "topL"
        })

        const approveOptions = {
            abi: nftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: NFT_MARKETPLACE_ADDRESS,
                tokenId: tokenId,
            },
        }
        
        try {
            await runContractFunction({
                params: approveOptions,
                onSuccess: async (tx) => {
                    handleApproveSuccess(nftAddress, tokenId, price, tx);
                },
                onError: (error) => {

                }
            });
        } catch (error) {
            // Handle the error here
            dispatch({
                type: "error",
                message: "You don't own the NFT",
                title: "Approve Failed",
                position: "topR",
            })
            router.push("/")
        }
    }
        
        const handleApproveSuccess = async(nftAddress, tokenId, price, tx)=>{
            dispatch({
                type: "info",
                message: "Please wait for the transaction to complete",
                title: "Approving NFT",
                position: "topR",
            })
            
            await tx.wait(1)
            dispatch({
                type: "success",
                message: "Time to List the NFT",
                title: "NFT Approved",
                position: "topL",
                
            })
            
            const listOptions = {
                abi: nftMarketplaceAbi,
                contractAddress: NFT_MARKETPLACE_ADDRESS,
                functionName: "listItem",
                params: {
                    nftAddress,
                    tokenId,
                    price
                },
                gas: 100000,
            }

        await runContractFunction({
            params: listOptions,
            onSuccess: handleListSuccess,
            onError: (error)=>{
                console.log(error)
                router.push("/")
            }
        })
    }

    const handleListSuccess = async (tx)=>{
        dispatch({
            type: "info",
            message: "Please wait for the transaction to complete",
            title: "Listing NFT",
            position: "topR",
        })
        await tx.wait(2)
        dispatch({
            type: "success",
            message: "NFT added to marketplace",
            title: "NFT listed",
            position: "topR"
        })
        router.push("/")
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