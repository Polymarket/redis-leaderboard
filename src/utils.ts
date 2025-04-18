import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { groupBy } from "lodash";
import { LeaderboardPosition, MarketPosition, BoardData } from "./interfaces";

// Following two functions taken from https://github.com/Polymarket/amm-maths/blob/master/src/utils.ts by Tom French
/**
 * Performs multiplication between a BigNumber and a decimal number while temporarily scaling the decimal to preserve precision
 * @param a - a BigNumber to multiply by b
 * @param b - a decimal by which to multiple a by.
 * @param scale - the factor by which to scale the numerator by before division
 */
const mulBN = (a: BigNumber, b: number, scale = 10000): BigNumber => {
    return a.mul(Math.round(b * scale)).div(scale);
};

/**
 * Performs division between two BigNumbers while temporarily scaling the numerator to preserve precision
 * @param a - the numerator
 * @param b - the denominator
 * @param scale - the factor by which to scale the numerator by before division
 */
const divBN = (a: BigNumber, b: BigNumberish, scale = 10000): number => {
    return a.mul(scale).div(b).toNumber() / scale;
};

/**
 *@function getEarnings - calculates winnings from graphQl query result
 @param {Object} position - the market position object
 */
export const getEarnings = (position: MarketPosition) => {
    const netQuantity = BigNumber.from(position.netQuantity);
    const outcomeTokenPrice = Number(
        position.market.outcomeTokenPrices[Number(position.outcomeIndex)],
    );
    const valueSold = BigNumber.from(position.valueSold);
    const valueBought = BigNumber.from(position.valueBought);
    const netValue = mulBN(netQuantity, outcomeTokenPrice);
    return netValue.add(valueSold).sub(valueBought);
};

/**
 *@function getROI - calculates ROI from graphQl query result
 @param {Object} position - the market position object
 */
export const getROI = (position: MarketPosition) => {
    const netQuantity = BigNumber.from(position.netQuantity);
    const outcomeTokenPrice = Number(
        position.market.outcomeTokenPrices[Number(position.outcomeIndex)],
    );

    const valueSold = BigNumber.from(position.valueSold);
    const valueBought = BigNumber.from(position.valueBought);
    const netValue = mulBN(netQuantity, outcomeTokenPrice);
    const netEarnings = netValue.add(valueSold).sub(valueBought);
    return divBN(netEarnings, valueBought) * 100;
};

/**
 * @function getAllPositions - constructs an array of objects representing all market positions
 * @param {Object} data - the data fetched by graphQL query from polymarket subgraph
 *
 */
export const getAllPositions = (data: Array<MarketPosition>) =>
    data.map((position: MarketPosition) => {
        const earnings = getEarnings(position);

        const roi = getROI(position);
        const positionObject = {
            user: position.user.id,
            trades: position.user.numTrades,
            earnings: earnings.toString(),
            invested: position.valueBought,
            roi,
        };

        return positionObject;
    });

/**
 * @function getAggregatedPositions - groups positions by user and aggregates the earnings and investment
 * @param {Array} allPositions - array of all market position objects
 *
 */
export const getAggregatedPositions = (allPositions: LeaderboardPosition[]) => {
    const positionsByUser = groupBy(allPositions, (position) => position.user);

    return Object.values(positionsByUser).map((position) => {
        const totalInvested = Object.values(position).reduce<BigNumber>(
            (t, { invested }) => t.add(BigNumber.from(invested)),
            BigNumber.from(0),
        );

        const totalEarnings = Object.values(position).reduce<BigNumber>(
            (t, { earnings }) => t.add(BigNumber.from(earnings)),
            BigNumber.from(0),
        );

        const totalROI = divBN(totalEarnings, totalInvested) * 100;

        return {
            user: position[0].user,
            trades: position[0].trades,
            invested: totalInvested.toString(),
            earnings: totalEarnings.toString(),
            roi: totalROI,
        };
    });
};

/**
 * @function getTopTen - sorts aggregated positions by earnings and slices top 10
 * @param {Array} aggregatedPositions - array of all aggregated market position objects
 *
 */
export const getTopTen = (
    aggregatedPositions: LeaderboardPosition[],
): BoardData => {
    aggregatedPositions.sort((a, b) => {
        return Number(b.earnings) - Number(a.earnings);
    });
    const board: LeaderboardPosition[] = aggregatedPositions.slice(0, 100);
    const topTen: BoardData = {
        leaderboardPositions: board,
    };
    return topTen;
};
