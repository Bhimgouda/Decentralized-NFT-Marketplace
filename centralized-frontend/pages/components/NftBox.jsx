import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftAbi from "../../constants/Nft-erc721-abi.json"
import axios from "axios";
import Image from "next/image"
import { Card } from "web3uikit";
import UpdateListingModal from "./UpdateListingModal"
import { useNotification } from "web3uikit";
import nftMarketPlaceAbi from "../../constants/contractAbi.json"
import nftMarketplacAddresses from "../../constants/contractAddresses.json"
import truncateStr from "../../utils/truncate";

const CHAIN_ID = 11155111
const NFT_MARKETPLACE_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]


const NftBox = ({ cancelItemListing, price, nftAddress, tokenId, seller, id, itemBought, updateItemListing, toggleLoading}) => {
    const {isWeb3Enabled, account} = useMoralis()
    const [tokenName, setTokenName] = useState("")
    const [imageUri, setImageUri] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    const [showModal, setShowModal] = useState(false)
    const dispatch = useNotification()

    const hideModal = ()=>{
        setShowModal(false)
    }

    const { runContractFunction: getTokenUri } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId,
        },
    })

    const {runContractFunction: buyItem} = useWeb3Contract({
        abi: nftMarketPlaceAbi,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId
        }
    })

    const {runContractFunction: cancelItem} = useWeb3Contract({
        abi: nftMarketPlaceAbi,
        contractAddress: NFT_MARKETPLACE_ADDRESS,
        functionName: "cancelItem",
        params: {
            nftAddress,
            tokenId
        }
    })
    
    async function updateUi(){
        const tokenIpfsUri = await getTokenUri()
        console.log(tokenIpfsUri)
        
        // As web only uses and understands http request and ipfs means nothing to it
        // Using IPFS Gateway: A server that will return IPFS files from a "Normal" URL.
        const requestUrl = tokenIpfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")
        const tokenUri = (await axios.get(requestUrl)).data
        const imageIpfsUri = tokenUri.image
        const imageUri = imageIpfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")
        setImageUri(imageUri)
        setTokenName(tokenUri.name)
        setTokenDescription(tokenUri.description)
    }

    useEffect(()=>{
        if(isWeb3Enabled){
            updateUi()
        }
    }, [isWeb3Enabled])

    
    const isOwnedByUser = seller.toLowerCase() == account
    const formattedSellerAddress = isOwnedByUser ? "you" : truncateStr(seller, 15)

    const handleCardClick = ()=>{
        isOwnedByUser ? setShowModal(true) : buyItem({
            onError: (error) => console.log(error),
            onSuccess: handleBuyItemSuccess
        })
    }

    const handleBuyItemSuccess = async (tx)=>{
        dispatch({
            type: "info",
            message: "Please wait for the transaction to complete",
            title: "Buying NFT",
            position: "topR",
        })
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item bought!!",
            title: "Item Bought",
            position: "topR"
        })
        itemBought(id)

    }

    const handleCancelItem = async()=>{
        await cancelItem({
            onSuccess: handleCancelItemSuccess,
            onError: (error) => console.log(error)
        })
    }

    const handleCancelItemSuccess = async (tx)=>{
        dispatch({
            type: "info",
            message: "Please wait for the transaction to complete",
            title: "Removing Listing",
            position: "topR",
        })
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Item removed from listing",
            title: "Item Removed",
            position: "topR"
        })
        cancelItemListing(id)
    }

    return ( 
        <div>
            <div>
                {imageUri ? (
                    <div className="mb-10">
                        <UpdateListingModal updateItemListing={updateItemListing} id={id} onClose={hideModal} isVisible={showModal}  nftAddress={nftAddress} tokenId={tokenId}></UpdateListingModal>
                        <Card onClick={handleCardClick} title={tokenName} description={tokenDescription.slice(0,29)}>
                            <div className="px-5">
                                <div className="flex flex-col items-end gap-2">
                                    <div>#{tokenId}</div>
                                    <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                                    <Image loader={()=>imageUri} src={imageUri} height="200" width="200" />
                                    <div>{price/10**18} ETH</div>
                                </div>
                            </div>
                        </Card>
                        {isOwnedByUser ? 
                            <div onClick={handleCancelItem} className="bg-black font-medium cursor-pointer text-sm rounded-md py-1 text-white text-center">REMOVE</div>
                            : 
                            <div onClick={handleCardClick} className=" bg-slate-500 font-medium cursor-pointer text-sm rounded-md py-1 text-white text-center">BUY</div>
                            }
                            
                    </div>
                ):(
                    <div>Loading...</div>
                )}
            </div>
        </div>
     );
}
 
export default NftBox;