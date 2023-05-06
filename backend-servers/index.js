if(!process.env.PRODUCTION) require("dotenv").config()
const express = require("express")
const app = express()
const Moralis = require("moralis").default
const {EvmChain} = require("@moralisweb3/common-evm-utils")

const PORT = process.env.PORT
const MORALIS_API_KEY = process.env.MORALIS_API_KEY

const address = "0x5e684251a27CaaA7f7b3Dfe73F0943248B6C3fFB";

const chain = EvmChain.SEPOLIA;

app.get("/", async (req,res)=>{
    const data = await getDemoData()
    return res.send(data)
})

async function getDemoData() {
    // Get native balance
    const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain,
    });
  
    // Format the native balance formatted in ether via the .ether getter
    const native = nativeBalance.result.balance.ether;
  
    return { native };
  }

const startServer = async()=>{
    await Moralis.start({
        apiKey: MORALIS_API_KEY
    })

    app.listen(PORT, ()=>{
        console.log(`Server Started on port ${PORT}`)
    })
}

startServer()
