import { useWeb3Contract } from "react-moralis";
import {Input, Modal, useNotification} from "web3uikit"
import nftMarketplaceAbi from "../../constants/contractAbi.json"
import { useState } from "react";
import {ethers} from "ethers"
import nftMarketplacAddresses from "../../constants/contractAddresses.json"

const CHAIN_ID = 11155111
const CONTRACT_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]

const UpdateListingModal = ({onClose, id, nftAddress, updateItemListing, tokenId, isVisible}) => {
    const [newPrice, setNewPrice] = useState(0)
    
    const {runContractFunction: updateListing} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "updateListing",
        params: {
            nftAddress,
            tokenId,
            newPrice: ethers.utils.parseEther(newPrice.toString() || "0")
        }
    })

    const dispatch = useNotification()

    const handleUpdateListingSuccess = async (tx)=>{
        await tx.wait()
        // await tx.wait(1)
        dispatch({
            type: "success",
            message: "listing updated",
            title: "Listing Updated - please refresh",
            position: "topR",
        })
        onClose && onClose()
        updateItemListing(id, newPrice)
        setNewPrice(0)
    }

    return ( 
        <div>
            <Modal onCancel={onClose} onCloseButtonPressed={onClose} isVisible={isVisible}>
                <Input 
                label="Update listing price in L1 Currency (ETH)"
                name="New Listing price"
                type="number"
                onChange={(event)=>{
                    setNewPrice(event.target.value)
                }}
                onBlur={() => {
                    if(newPrice !== 0){
                        updateListing({
                            onError: (error) => {
                                console.log(error)
                            },
                            onSuccess: handleUpdateListingSuccess
                        })
                    }
                }}
                />
            </Modal>
        </div>
     );
}
 
export default UpdateListingModal;

