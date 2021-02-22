import { ApolloClient, gql } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import "cross-fetch/polyfill";
import { getAllPositions, getAggregatedPositions, getTopTen } from "./utils";
import {MarketPosition} from "./interfaces";


const getGlobalLeaderboardDataQuery = gql`
     
query positions($skipValue: Int!)         {
    marketPositions(where: {valueBought_gt: 0}, first: 1000, skip: $skipValue){
        user {
            id
            
             
        }
        outcomeIndex
        valueBought
        valueSold
        netQuantity
        market {
            outcomeTokenPrices
        }
    
    }
}`;
const client = new ApolloClient({
    uri:
        process.env.SUBGRAPH_URL ||
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new InMemoryCache(),
});

export const getGlobalLeaderboardData = async () => {
    let skipValue = 0;
    let data: MarketPosition[] = [];
  for (let i = 0; i < 20; i++){
      if (i !==0) 
        skipValue + 1000;
  
  let dataChunk = await client.query({
        query: getGlobalLeaderboardDataQuery,
        variables: { skipValue: skipValue },
    });
  
   dataChunk.data.marketPositions.forEach((element: MarketPosition) => {
       data.push(element)
       if (dataChunk.data.marketPositions.length < 1000) {
           return
       }
   });
    
}  

    const allPositions = getAllPositions(data);
    const aggregatedPositions = getAggregatedPositions(allPositions);
    const topTen = getTopTen(aggregatedPositions);
    return topTen;
};

export default getGlobalLeaderboardData;