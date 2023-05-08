import {useEffect, useState} from "react"
import axios from "axios"
import NftBox from "./components/NftBox";
import { useMoralis } from "react-moralis"

export async function getServerSideProps(){
  try{
    const {data} = await axios.get("http://127.0.0.1:5000/api/listing")
    return {
      props: {
        data,
      }
    }
  } catch(e){
    return {
      props: {
        error: 'Internal server error',
      },
    };
  }
}

export default function Home({data, error}) {
  const [listing, setListing] = useState([])
  const {isWeb3Enabled} = useMoralis()

  useEffect(()=>{
    if(!error && data){
      setListing([...data])
    }
  }, [data, error])

  return (
    <div className="container mx-auto">
      <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
      <div className="flex flex-wrap">
        {isWeb3Enabled ? (
          listing.map(({price, nftAddress, tokenId, seller}, index) =>{
            return<NftBox key={`${nftAddress}${tokenId}${index}`} price={price} nftAddress={nftAddress} tokenId={tokenId} seller={seller} />
})
        )
        :
        (
          <div>Connect Your Wallet and Switch to sepolia Testnet</div>
        )}
      </div>
    </div>
  )
}
