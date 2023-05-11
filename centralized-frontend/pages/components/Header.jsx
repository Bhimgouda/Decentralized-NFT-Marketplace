import {ConnectButton} from "web3uikit"
import Link from "next/link"

const Header = () => {
    return ( 
        <nav className="px-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">NFT Marketplace</h1>
            <div className="flex flex-row items-center">
                <Link href="/" className="mr-5 bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800">
                    Buy
                </Link>
                <Link href="/sell-nft" className="bg-black text-white font-bold py-2 px-4 rounded hover:bg-gray-800">
                    Sell
                </Link>
            </div>
                <ConnectButton moralisAuth={false}/>
        </nav>
     );
}
 
export default Header;