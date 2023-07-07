import { gql } from "@apollo/client"

const NULL_ADDRESS = "0x0000000000000000000000000000000000000000"
const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD"

export const GET_LISTED_ITEMS = gql`
{
        listedItems(first: 50, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`
export const GET_SOLD_ITEMS = gql`
{
  itemBoughts(first: 5, orderBy: transactionTime, orderDirection: desc) {
    id
    buyer
    nftAddress
    tokenId
    price
    transactionHash
    transactionTime
  }
}
`