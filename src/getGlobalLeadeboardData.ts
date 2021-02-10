import { ApolloClient, gql } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import "cross-fetch/polyfill";
import { getAllPositions, getAggregatedPositions, getTopTen } from "./utils";
import {Position, QueryData} from "./interfaces";


const getGlobalLeaderboardDataQuery = gql`
     
query positions($skipValue: Number!)         {
    marketPositions(where: {valueBought_gt: 0 }, first: 1000, skip: $skipValue){
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
    
  
 
    
  let data = await client.query({
        query: getGlobalLeaderboardDataQuery,
        variables: { skipValue: 1000 },
    });
    
    
    console.log(data);
    const allPositions = getAllPositions(data.data.marketPositions);
    const aggregatedPositions = getAggregatedPositions(allPositions);
    const topTen = getTopTen(aggregatedPositions);
    return topTen;
};

export default getGlobalLeaderboardData;