import { BigNumber } from "@ethersproject/bignumber";

export interface BoardData {
    leaderBoardPositions: LeaderBoardPosition[];
}

export interface Position {
    user: { id: string };
    netQuantity: string;
    market: { outcomeTokenPrices: string[] };
    outcomeIndex: number;
    valueSold: string;
    valueBought: string;
 
}
export interface LeaderBoardPosition {
    user: string;
    invested: string;
    earnings: string;
    roi: number;
}
export interface RedisLeaderBoardPositions extends BoardData {
    lastUpdate: number;
}

