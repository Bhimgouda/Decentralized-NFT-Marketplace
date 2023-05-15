import { useEffect, useState } from "react";
import axios from "axios"
import truncateStr from "../../utils/truncate";
import {ethers} from "ethers"
import { GET_SOLD_ITEMS } from "../../constants/subgraphQueries";
import { useMoralis } from "react-moralis";
import { useQuery } from "@apollo/client";

const Table = () => {
  const {isWeb3Enabled, chainId, account} = useMoralis()
    const [soldItems, setSoldItems] = useState([])
    const {loading, error, data} = useQuery(GET_SOLD_ITEMS)

    useEffect(()=>{
      if(!error && data){
        setSoldItems([...data.itemBoughts])
      }
    }, [data, error, isWeb3Enabled])



        return ( 
        <div className="bg-slate-200 mt-5 text-black p-4 rounded-lg">
        <h2 className="text-xl font-bold mt-4 mb-4">Recent Sales History of the Last 5 NFTs</h2>
        <div className="">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2">Txn Hash</th>
              <th className="py-2 pr-20">Buyer</th>
              <th className="py-2 pr-20">Nft Address</th>
              <th className="py-2 pr-20">Token Id</th>
              <th className="py-2 pr-20">Price</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody className="max-h-100 overflow-y-scroll">
            {soldItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2">{item?.transactionHash ? truncateStr(item.transactionHash, 15): null}</td>
                <td className="py-2">{item.buyer}</td>
                <td className="py-2">{item.nftAddress}</td>
                <td className="py-2">{item.tokenId}</td>
                <td className="py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded w-full text-white  ${
                        item.status === 'Completed'
                        ? 'bg-slate-500': "bg-slate-500"
                    }`}
                  >
                    {(item.price/10**18)} eth
                  </span>
                </td>
                <td className="py-2 px-5">{ new Date(item.transactionTime * 1000).toLocaleString().slice(0, )}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
     );
}
 
export default Table;