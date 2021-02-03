"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopTen = exports.getAggregatedPositions = exports.getAllPositions = exports.getROI = exports.getEarnings = void 0;
var bignumber_1 = require("@ethersproject/bignumber");
var _ = __importStar(require("lodash"));
// Following two functions taken from https://github.com/TokenUnion/amm-maths/blob/master/src/utils.ts by Tom French
/**
 * Performs multiplication between a BigNumber and a decimal number while temporarily scaling the decimal to preserve precision
 * @param a - a BigNumber to multiply by b
 * @param b - a decimal by which to multiple a by.
 * @param scale - the factor by which to scale the numerator by before division
 */
var mulBN = function (a, b, scale) {
    if (scale === void 0) { scale = 10000; }
    return a.mul(Math.round(b * scale)).div(scale);
};
/**
 * Performs division between two BigNumbers while temporarily scaling the numerator to preserve precision
 * @param a - the numerator
 * @param b - the denominator
 * @param scale - the factor by which to scale the numerator by before division
 */
var divBN = function (a, b, scale) {
    if (scale === void 0) { scale = 10000; }
    return a.mul(scale).div(b).toNumber() / scale;
};
/**
 *@function getEarnings - calculates winnings from graphQl query result
 @param {Object} position - the market position object
 */
var getEarnings = function (position) {
    var netQuantity = bignumber_1.BigNumber.from(position.netQuantity);
    var outcomeTokenPrice = Number(position.market.outcomeTokenPrices[position.outcomeIndex]);
    var valueSold = bignumber_1.BigNumber.from(position.valueSold);
    var valueBought = bignumber_1.BigNumber.from(position.valueBought);
    var netValue = mulBN(netQuantity, outcomeTokenPrice);
    return netValue.add(valueSold).sub(valueBought).toNumber();
};
exports.getEarnings = getEarnings;
/**
 *@function getROI - calculates ROI from graphQl query result
 @param {Object} position - the market position object
 */
var getROI = function (position) {
    var netQuantity = bignumber_1.BigNumber.from(position.netQuantity);
    var outcomeTokenPrice = Number(position.market.outcomeTokenPrices[position.outcomeIndex]);
    var valueSold = bignumber_1.BigNumber.from(position.valueSold);
    var valueBought = bignumber_1.BigNumber.from(position.valueBought);
    var netValue = mulBN(netQuantity, outcomeTokenPrice);
    var netEarnings = netValue.add(valueSold).sub(valueBought);
    return divBN(netEarnings, valueBought) * 100;
};
exports.getROI = getROI;
/**
 * @function getAllPositions - constructs an array of objects representing all market positions
 * @param {Object} data - the data fetched by graphQL query from polymarket subgraph
 *
 */
var getAllPositions = function (data) {
    var allPositions = [];
    data.forEach(function (position) {
        var earnings = exports.getEarnings(position);
        var roi = exports.getROI(position);
        var positionObject = {
            user: position.user.id,
            earnings: earnings,
            invested: Number(position.valueBought),
            roi: roi,
        };
        allPositions.push(positionObject);
    });
    return allPositions;
};
exports.getAllPositions = getAllPositions;
/**
 * @function getAggregatedPositions - groups positions by user and aggregates the earnings and investment
 * @param {Array} allPositions - array of all market position objects
 *
 */
var getAggregatedPositions = function (allPositions) {
    var aggregatedPositions = [];
    var positionsByUser = _.groupBy(allPositions, function (position) { return position.user; });
    Object.values(positionsByUser).forEach(function (position) {
        var totalInvested = Object.values(position).reduce(function (t, _a) {
            var invested = _a.invested;
            return t + invested;
        }, 0);
        var totalEarnings = Object.values(position).reduce(function (t, _a) {
            var earnings = _a.earnings;
            return t + earnings;
        }, 0);
        var totalROI = Object.values(position).reduce(function (t, _a) {
            var roi = _a.roi;
            return t + roi;
        }, 0);
        var obj = {
            user: position[0].user,
            invested: totalInvested,
            earnings: totalEarnings,
            roi: totalROI,
        };
        aggregatedPositions.push(obj);
    });
    return aggregatedPositions;
};
exports.getAggregatedPositions = getAggregatedPositions;
/**
 * @function getTopTen - sorts aggregated positions by earnings and slices top 10
 * @param {Array} aggregatedPositions - array of all aggregated market position objects
 *
 */
var getTopTen = function (aggregatedPositions) {
    aggregatedPositions.sort(function (a, b) {
        return Number(a.earnings) > Number(b.earnings) ? -1 : 1;
    });
    var board = aggregatedPositions.slice(0, 10);
    var topTen = {
        leaderBoardPositions: board,
    };
    return topTen;
};
exports.getTopTen = getTopTen;
