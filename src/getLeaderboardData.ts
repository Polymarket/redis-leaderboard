import { ApolloClient, gql } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import "cross-fetch/polyfill";
import { getAllPositions, getAggregatedPositions, getTopTen } from "./utils";

const getLeaderboardDataQuery = gql`
    query positions($marketAddress: String!) {
        marketPositions(where: { market: $marketAddress, valueBought_gt: 0 }, first: 1000) {
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
    }
`;

const client = new ApolloClient({
    uri:
        process.env.SUBGRAPH_URL ||
        "https://api.thegraph.com/subgraphs/name/tokenunion/polymarket-matic",
    cache: new InMemoryCache(),
});
/**
 * @function getLeaderboardData - fetches market data and calculates top ten traders for a given market address
 * @param {string} marketMakerAddress - the market address 
 */
export const getLeaderboardData = async (marketMakerAddress: string) => {
    const data = await client.query({
        query: getLeaderboardDataQuery,
        variables: { marketAddress: marketMakerAddress.toLowerCase() },
    });
    const allPositions = getAllPositions(data.data.marketPositions);
    const aggregatedPositions = getAggregatedPositions(allPositions);
    const topTen = getTopTen(aggregatedPositions);
    return topTen;
};

export default getLeaderboardData;
