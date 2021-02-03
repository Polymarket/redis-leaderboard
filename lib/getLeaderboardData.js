"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboardData = void 0;
var core_1 = require("@apollo/client/core");
var cache_1 = require("@apollo/client/cache");
require("cross-fetch/polyfill");
var utils_1 = require("./utils");
var getLeaderboardDataQuery = core_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    query positions($marketAddress: String!) {\n        marketPositions(where: { market: $marketAddress, valueBought_gt: 0 }) {\n            user {\n                id\n            }\n            outcomeIndex\n            valueBought\n            valueSold\n            netQuantity\n            market {\n                outcomeTokenPrices\n            }\n        }\n    }\n"], ["\n    query positions($marketAddress: String!) {\n        marketPositions(where: { market: $marketAddress, valueBought_gt: 0 }) {\n            user {\n                id\n            }\n            outcomeIndex\n            valueBought\n            valueSold\n            netQuantity\n            market {\n                outcomeTokenPrices\n            }\n        }\n    }\n"])));
var client = new core_1.ApolloClient({
    uri: process.env.SUBGRAPH_URL ||
        "https://subgraph-matic.poly.market/subgraphs/name/TokenUnion/polymarket",
    cache: new cache_1.InMemoryCache(),
});
/**
 * @function getLeaderboardData - fetches market data and calculates top ten traders for a given market address
 * @param {string} marketMakerAddress - the market address
 */
var getLeaderboardData = function (marketMakerAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var data, allPositions, aggregatedPositions, topTen;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, client.query({
                    query: getLeaderboardDataQuery,
                    variables: { marketAddress: marketMakerAddress.toLowerCase() },
                })];
            case 1:
                data = _a.sent();
                allPositions = utils_1.getAllPositions(data.data.marketPositions);
                aggregatedPositions = utils_1.getAggregatedPositions(allPositions);
                topTen = utils_1.getTopTen(aggregatedPositions);
                return [2 /*return*/, topTen];
        }
    });
}); };
exports.getLeaderboardData = getLeaderboardData;
exports.default = exports.getLeaderboardData;
var templateObject_1;
