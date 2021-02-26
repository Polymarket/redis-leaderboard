

export interface BoardData {
    leaderboardPositions: LeaderboardPosition[];
}
export interface MarketPosition {
    market: {
        id?: string;
        outcomeTokenPrices: string[];
        conditions?: {
            payouts: string[];
        }[];
    };
    user: {
        id: string;
        numTrades: string;
        collateralVolume: string;
    }
   
    outcomeIndex: string;
    quantityBought: string;
    netQuantity: string;
    valueBought: string;
    valueSold: string;
    netValue?: string;
}
export interface LeaderboardPosition {
    user: string;
    trades: string;
    
    invested: string;
    earnings: string;
    roi: number;
}
export interface RedisLeaderboardPositions extends BoardData {
    lastUpdate: number;
}

