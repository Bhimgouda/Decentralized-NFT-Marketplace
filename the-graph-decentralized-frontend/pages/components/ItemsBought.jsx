import { useQuery, gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";

const ItemsBought = () => {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [itemsBought, setItemsBought] = useState([]);
    const { loading, error, data } = useQuery(gql`
        {
            itemBoughts(first: 5, where: { buyer: "${account}" }) {
                id
                buyer
                nftAddress
                tokenId
                price
                transactionHash
                transactionTime
            }
        }
    `);

    useEffect(()=>{
        if(!error && data){
            setItemsBought([...data.itemBoughts])
          }
    }, [isWeb3Enabled, data,])

    return itemsBought.length ? (
        <div className="flex-col w-1/2 m-auto my-20">
  <div className="mb-2 rounded-lg p-4">
    <h2 className="py-2 my-1 text-center font-bold text-3xl">Your Recently Bought NFT's</h2>
    <p className="font-bold text-sm text-center">Note: Now you can copy the NFT address and Token Id to import NFTs in your METAMASK</p>
  </div>
  <div className="flex justify-between bg-gray-200 rounded-lg p-4">
    <div className="p-2 font-bold">NFT Address</div>
    <div className="p-2 font-bold">TokenId</div>
  </div>
  <div className="bg-black rounded-">
  {itemsBought.map((item) => (
    <div className="flex justify-between text-white rounded-lg p-4" key={item.id}>
      <div className="p-2">{item.nftAddress}</div>
      {/* <Image src ></Image> */}
      <div className="p-2">{item.tokenId}</div>
    </div>
  ))}
  </div>
</div>


      
        
    ) : null;
};

export default ItemsBought;
