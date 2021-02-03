import { LeaderBoardPosition, Position, BoardData } from "./interfaces";
/**
 *@function getEarnings - calculates winnings from graphQl query result
 @param {Object} position - the market position object
 */
export declare const getEarnings: (position: Position) => number;
/**
 *@function getROI - calculates ROI from graphQl query result
 @param {Object} position - the market position object
 */
export declare const getROI: (position: Position) => number;
/**
 * @function getAllPositions - constructs an array of objects representing all market positions
 * @param {Object} data - the data fetched by graphQL query from polymarket subgraph
 *
 */
export declare const getAllPositions: (data: Array<Position>) => LeaderBoardPosition[];
/**
 * @function getAggregatedPositions - groups positions by user and aggregates the earnings and investment
 * @param {Array} allPositions - array of all market position objects
 *
 */
export declare const getAggregatedPositions: (allPositions: LeaderBoardPosition[]) => LeaderBoardPosition[];
/**
 * @function getTopTen - sorts aggregated positions by earnings and slices top 10
 * @param {Array} aggregatedPositions - array of all aggregated market position objects
 *
 */
export declare const getTopTen: (aggregatedPositions: LeaderBoardPosition[]) => BoardData;
