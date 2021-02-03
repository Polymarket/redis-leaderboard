import "cross-fetch/polyfill";
/**
 * @function getLeaderboardData - fetches market data and calculates top ten traders for a given market address
 * @param {string} marketMakerAddress - the market address
 */
export declare const getLeaderboardData: (marketMakerAddress: string) => Promise<import("./interfaces").BoardData>;
export default getLeaderboardData;
