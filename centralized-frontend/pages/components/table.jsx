import { useEffect, useState } from "react";
import axios from "axios"
import truncateStr from "../../utils/truncate";
import {ethers} from "ethers"

const Table = () => {
    const [soldItems, setSoldItems] = useState([])

    useEffect(()=>{
        async function getSoldItems(){
            const response = await axios.get("http://127.0.0.1:5000/api/sold-items")
            console.log(response.data)
            setSoldItems(response.data)
        }
        getSoldItems()
    }, [])


        return ( 
        <div className="bg-slate-200 mt-5 text-black p-4 rounded-lg">
        <h2 className="text-xl font-bold mt-4 mb-4">Recent Sales History of the Last 5 NFTs</h2>
        <div className="">
        <table className="w-full">
          <thead>
            <tr>
              <th className="py-2">Txn Hash</th>
              <th className="py-2">Buyer</th>
              <th className="py-2">Nft Address</th>
              <th className="py-2">Token Id</th>
              <th className="py-2">Price</th>
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
                <td className="py-2 px-5">{item.createdAt.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
     );
}
 
export default Table;