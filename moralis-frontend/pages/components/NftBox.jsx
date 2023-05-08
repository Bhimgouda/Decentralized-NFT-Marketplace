import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import nftMarketPlaceAbi from "../../constants/contractAbi.json"
import nftAbi from "../../constants/Nft-erc721-abi.json"
import axios from "axios";
import Image from "next/image"
import { Card } from "web3uikit";

const truncateStr = (fullStr, strLen) =>{
    if(fullStr.length <= strLen) return fullStr;

    const separator = "..."
    const seperatorLength = separator.length
    const charsToShow = strLen - seperatorLength
    const frontChars = Math.ceil(charsToShow / 2)
    const backChars = Math.floor(charsToShow / 2)
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    )
}

const NftBox = ({price, nftAddress, tokenId, seller}) => {
    const {isWeb3Enabled, account} = useMoralis()
    const [tokenName, setTokenName] = useState("")
    const [imageUri, setImageUri] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    
    const { runContractFunction: getTokenUri } = useWeb3Contract({
        abi: nftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            _tokenId: tokenId,
        },
    })
    
    async function updateUi(){
        const tokenIpfsUri = await getTokenUri()
        
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

    return ( 
        <div>
            <div>
                {imageUri ? (
                    <Card title={tokenName} description={tokenDescription}>
                        <div className="p-2">
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">Owned by {formattedSellerAddress}</div>
                                <Image loader={()=>imageUri} src={imageUri} height="250" width="250" />
                                <div>{price/10**18} ETH</div>
                            </div>
                        </div>
                    </Card>
                ):(
                    <div>Loading...</div>
                )}
            </div>
        </div>
     );
}
 
export default NftBox;