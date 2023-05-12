import {useEffect, useState} from "react"
import axios from "axios"
import NftBox from "./components/NftBox";
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketPlaceAbi from "../constants/contractAbi.json"
import nftMarketplacAddresses from "../constants/contractAddresses.json"
import {ethers} from "ethers"
import { useNotification } from "web3uikit";
import Table from "./components/table";
import Hero from "./components/Hero";
import Overlay from "./components/overlay"

const CHAIN_ID = 11155111
const NFT_MARKETPLACE_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]

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
  const [earnings, setEarnings] = useState("0")
  const [loading, setLoading] = useState({
    loading: false,
    message: "Wait"
  })
  const {isWeb3Enabled, chainId, account} = useMoralis()
  const dispatch = useNotification()

  const itemBought = (id)=>{
    cancelItemListing(id)
  }

  const updateItemListing = (id, price)=>{
    const newListing = [...listing]
    newListing[id].price = ethers.utils.parseUnits(price.toString(), 18)
    setListing(newListing)
  }

  const cancelItemListing = (id)=>{
    const newListing = [...listing];
    newListing.splice(id, 1)
    setListing(newListing)
  }

  const toggleLoading = (message)=>{
    if(message){
      setLoading({loading: true, message})
    }
    setLoading({loading: false, message: null})
  }

  const {runContractFunction: getProceeds} = useWeb3Contract({
    abi: nftMarketPlaceAbi,
    contractAddress: NFT_MARKETPLACE_ADDRESS,
    functionName: "getProceeds",
    params:{
      seller: account 
    }
  })

  const {runContractFunction: withDrawProceeds} = useWeb3Contract({
    abi: nftMarketPlaceAbi,
    contractAddress: NFT_MARKETPLACE_ADDRESS,
    functionName: "withDrawProceeds",
  })

  const handleWithdrawProceeds = async ()=>{
    await withDrawProceeds({
      onSuccess: handleWithdrawProceedsSuccess,
      onError: (e)=>console.log(e)
    })
  }

  const handleWithdrawProceedsSuccess = async (tx)=>{
    dispatch({
      type: "success",
      message: `Withdrawl of ${earnings} successful!!`,
      title: "Withdraw success",
      position: "topR"
    })
    setEarnings("0")
  }

  async function getEarnings(){
    await getProceeds({
      onSuccess: (data)=>{
        setEarnings(ethers.utils.formatEther(data))
      },
      onError: (e)=>console.log(e)
    })
  }

  useEffect(()=>{
    if(!error && data){
      setListing([...data])
    }
    if(isWeb3Enabled){
      getEarnings()
    }
  }, [data, error, isWeb3Enabled])

  return (
         loading.loading ? <Overlay loading={loading} />
         : 
         <>
      <Hero />
      <div onClick={handleWithdrawProceeds} className="bg-black py-2 cursor-pointer text-white text-center font-medium">Withdraw Earnings{" => "}{`${earnings} ETH`}</div>
      <div className="container mx-auto m-10">
        <div className="flex justify-center flex-wrap gap-10">
        <h1 className="py-4 my-5 text-center font-bold w-full text-2xl">Recently Listed</h1>
          {isWeb3Enabled && parseInt(chainId) === CHAIN_ID ? (
            listing.map(({price, nftAddress, tokenId, seller }, index) =>{
              return<NftBox toggleLoading={toggleLoading} key={`${nftAddress}${tokenId}${index}`} cancelItemListing={cancelItemListing} price={price} nftAddress={nftAddress} itemBought={itemBought} updateItemListing={updateItemListing} tokenId={tokenId} seller={seller} id={index} />
            })
            )
            :
            (
              <div className="text-center">Connect Your Wallet and Switch to sepolia Testnet</div>
              )}
        </div>
      </div>
      <Table />
    </>
    
  )
}
