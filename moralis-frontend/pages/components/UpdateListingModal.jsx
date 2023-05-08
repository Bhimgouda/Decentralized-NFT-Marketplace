import { useWeb3Contract } from "react-moralis";
import {Input, Modal} from "web3uikit"
import nftMarketplaceAbi from "../../constants/contractAbi.json"
import nftMarketplacAddresses from "../../constants/contractAddresses.json"
import { useState } from "react";
import {ethers} from "ethers"

const CHAIN_ID = 31337
const CONTRACT_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]

const UpdateListingModal = ({onClose, nftAddress, tokenId, isVisible}) => {

    const [newPrice, setNewPrice] = useState("0")

    const {runContractFunction: updateListing} = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: CONTRACT_ADDRESS,
        functionName: "updateListing",
        params: {
            nftAddress,
            tokenId,
            newPrice: ethers.utils.parseEther(newPrice)
        }
    })

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
                onOk={()=>{
                    updateListing({
                        onError: (error=> console.log(error))
                    })
                }}
                />
            </Modal>
        </div>
     );
}
 
export default UpdateListingModal;

