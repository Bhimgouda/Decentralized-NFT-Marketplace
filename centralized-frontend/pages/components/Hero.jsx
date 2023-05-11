import Image from "next/image"

const Hero = () => {

  const imageUri = "https://api.thegraph.com/ipfs/api/v0/cat?arg=QmTmquVfdBgvc7Rter4PrUBueuamAG2RhmSZYyGa72p4PT"


    return ( 
        <section className="bg-gray-900">
      <div className="container mx-auto flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-8 text-center">
          Welcome to Bhim's NFT Marketplace
        </h1>
        <p className="text-xl sm:text-2xl text-white mb-12 text-center">
          Discover, buy, and sell unique digital assets
        </p>
        <div className="w-80 h-80 relative rounded-full overflow-hidden">
          
          <Image
          loader={()=>imageUri}
           src={imageUri} // Replace with your own image URL
          alt="Hero Image"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />

        </div>
      </div>
    </section>
     );
}
 
export default Hero;