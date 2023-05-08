import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketPlaceAbi from "../../constants/contractAbi.json"
import nftAbi from "../../constants/Nft-erc721-abi.json"

const NftBox = ({price, nftAddress, tokenId, seller}) => {
    const {isWeb3Enabled} = useMoralis()
    const [imageUri, setImageUri] = useState("")

    
    const { runContractFunction: getTokenUri } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    })
    
    async function updateUi(){
        const tokenUri = await getTokenUri()
        console.log(tokenUri)
    }

    useEffect(()=>{
        if(isWeb3Enabled){
            updateUi()
        }
    }, [isWeb3Enabled])

    return ( 
        <div>

        </div>
     );
}
 
export default NftBox;