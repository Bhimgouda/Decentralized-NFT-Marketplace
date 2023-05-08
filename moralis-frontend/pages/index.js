import {useEffect, useState} from "react"
import axios from "axios"
import NftBox from "./components/NftBox";

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


  useEffect(()=>{
    if(!error && data){
      setListing([...data])
    }
  }, [data, error])

  return (
    <div>
      {listing.map(({price, nftAddress, tokenId, seller}, index) =>(
        <NftBox key={`${nftAddress}${tokenId}${index}`} price={price} nftAddress={nftAddress} tokenId={tokenId} seller={seller} />
      ))}
    </div>
  )
}
