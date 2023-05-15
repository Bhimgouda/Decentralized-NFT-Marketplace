import axios from "axios"

export async function updateNftImages(getTokenUri){
    const tokenIpfsUri = await getTokenUri()
    
    // As web only uses and understands http request and ipfs means nothing to it
    // Using IPFS Gateway: A server that will return IPFS files from a "Normal" URL.
    const requestUrl = tokenIpfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")
    const tokenUri = (await axios.get(requestUrl)).data
    const imageIpfsUri = tokenUri.image
    const imageUri = imageIpfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")
    return {
        imageUri,
        tokenName: tokenUri.name,
        tokenDescription: tokenUri.description
    }
}