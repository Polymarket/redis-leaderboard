import { ApolloClient, gql } from "@apollo/client/core";
import { InMemoryCache } from "@apollo/client/cache";
import "cross-fetch/polyfill";
import {
    getAllPositions,
    getAggregatedPositions,
    getTopTen,
    LeaderBoardPosition,
} from "./utils";

const getLeaderboardDataQuery = gql`
    query positions($marketAddress: String!) {
        marketPositions(where: { market: $marketAddress, valueBought_gt: 0 }) {
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
    }
`;

const client = new ApolloClient({
    uri:
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new InMemoryCache(),
});
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
