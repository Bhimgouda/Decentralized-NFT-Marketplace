import {useEffect, useState} from "react"
import axios from "axios"
import NftBox from "./components/NftBox";
import { useMoralis, useWeb3Contract } from "react-moralis"
import nftMarketPlaceAbi from "../constants/contractAbi.json"
import nftMarketplacAddresses from "../constants/contractAddresses.json"
import {ethers} from "ethers"
import { useNotification } from "web3uikit";
import { useQuery } from "@apollo/client";
import { GET_LISTED_ITEMS } from "../constants/subgraphQueries";

const CHAIN_ID = 11155111
const NFT_MARKETPLACE_ADDRESS = nftMarketplacAddresses[CHAIN_ID]["NftMarketplace"]

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export default function Home() {

  const {loading, error, data} = useQuery(GET_LISTED_ITEMS)

  const [listing, setListing] = useState([])
  const [earnings, setEarnings] = useState("0")
  const {isWeb3Enabled, chainId, account} = useMoralis()
  const dispatch = useNotification()

  console.log(listing)
  
  useEffect(()=>{
    if(!error && data){
      setListing([...data.listedItems])
    }
    if(isWeb3Enabled){
      getEarnings()
    }
  }, [data, error, isWeb3Enabled])

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


  return (
    <>
    
      <div onClick={handleWithdrawProceeds} className="bg-black py-2 cursor-pointer text-white text-center font-medium">Withdraw Earnings{" => "}{`${earnings} ETH`}</div>
      <div className="container mx-auto">
        <div className="flex justify-center flex-wrap gap-10">
        <h1 className="py-4 my-5 text-center font-bold w-full text-2xl">Recently Listed</h1>
          {isWeb3Enabled && parseInt(chainId) === CHAIN_ID ? (
            loading || !data.listedItems ? (
              <div>Loading...</div> ) :
          listing.map(({price, nftAddress, tokenId, seller }, index) =>{
            console.log("hey")
              return<NftBox key={`${nftAddress}${tokenId}${index}`} cancelItemListing={cancelItemListing} price={price} nftAddress={nftAddress} itemBought={itemBought} updateItemListing={updateItemListing} tokenId={tokenId} seller={seller} id={index} />
          })
          )
          :
          (
            <div className="text-center">Connect Your Wallet and Switch to sepolia Testnet</div>
          )}
        </div>
      </div>
    </>
  )
}
