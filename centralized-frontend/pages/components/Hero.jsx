import Image from "next/image"

const Hero = () => {

  const imageUri = "https://img.freepik.com/premium-vector/mutant-ape-yacht-club-nft-artwork-collection-set-unique-bored-monkey-character-nfts-variant_361671-259.jpg?w=2000"


    return ( 
        <section className="bg-slate-200 flex items-center">
      <div className="container mx-auto flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl sm:text-6xl font-bold text-black mb-8 text-center">
          Decentralized NFT Marketplace
        </h1>
        <p className="text-xl sm:text-2xl text-black mb-12 text-center">
          Discover, buy, and sell unique digital assets
        </p>
      </div>
        <div className="w-100 h-90 relative rounded-full overflow-hidden">
          <Image
          loader={()=>imageUri}
           src={imageUri} // Replace with your own image URL
          alt="Hero Image"
          width={800}
          height={500}
          className="rounded-lg shadow-lg"
        />

        </div>
    </section>
     );
}
 
export default Hero;