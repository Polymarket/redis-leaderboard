import { ApolloClient, gql } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import "cross-fetch/polyfill";
import { getAllPositions, getAggregatedPositions, getTopTen } from "./utils";
import {MarketPosition} from "./interfaces";


const getGlobalLeaderboardDataQuery = gql`
     
query positions($skipValue: Int!)         {
    marketPositions(where: {valueBought_gt: 0}, first: 1000, skip: $skipValue, orderBy: valueBought, orderDirection: desc){
        user {
            id
            numTrades
             
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
        "https://api.thegraph.com/subgraphs/name/tokenunion/polymarket-matic",
    cache: new InMemoryCache(),
});

export const getGlobalLeaderboardData = async () => {
    let skipValue = 0;
    let data: MarketPosition[] = [];
  for (let i = 0; i < 5; i++){
    
        
         let dataChunk = await client.query({
        query: getGlobalLeaderboardDataQuery,
        variables: { skipValue: skipValue },
    });
  
   dataChunk.data.marketPositions.forEach((element: MarketPosition) => {
       data.push(element)
     
      
   });
   skipValue += 1000;
   console.log(skipValue);
}  

    const allPositions = getAllPositions(data);
    const aggregatedPositions = getAggregatedPositions(allPositions);
    const topTen = getTopTen(aggregatedPositions);
    return topTen;
};

export default getGlobalLeaderboardData;