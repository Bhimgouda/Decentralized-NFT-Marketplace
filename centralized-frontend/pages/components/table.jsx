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
        <div className="bg-gray-900 text-white p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Nft's Sold Till Date</h2>
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
          <tbody>
            {soldItems.map((item) => (
              <tr key={item.id}>
                <td className="py-2">{item?.transactionHash ? truncateStr(item.transactionHash, 15): null}</td>
                <td className="py-2">{item.buyer}</td>
                <td className="py-2">{item.nftAddress}</td>
                <td className="py-2">{item.tokenId}</td>
                <td className="py-2">
                  <span
                    className={`inline-block px-3 py-1 rounded w-full  ${
                        item.status === 'Completed'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
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
     );
}
 
export default Table;