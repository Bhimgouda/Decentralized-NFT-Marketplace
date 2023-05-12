import '../styles/globals.css'
import {MoralisProvider} from "react-moralis"
import Header from './components/Header'
import Head from 'next/head'
import {NotificationProvider} from "web3uikit"

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="Decentralized NFT Marketplace" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header />
            <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </>
  )
}

export default MyApp
