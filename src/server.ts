import redis from "redis";
import express from "express";
import cors from "cors";
import { getLeaderboardData } from "./getLeaderboardData";
import { RedisLeaderboardPositions, BoardData } from "./interfaces";
import { getGlobalLeaderboardData } from "./getGlobalLeadeboardData";

const client = redis.createClient({
    url:
        process.env.REDIS_URL ||
        "rediss://default:ognm4av69h62s0jc@redis-27db2bc3-polymarket-d1ee.aivencloud.com:12790",
});
client.on("error", (error) => {
    console.error(error);
});

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

const CACHE_TTL = 1000 * 60 * 60;

app.get("/", async (req, res) => {
    res.send({
        instructions:
            "Just make a GET /leaderboard/:marketMakerAddress to retrieve the leaderboard data",
    });
});
const updateCache = (
    marketMakerAddress: string,
    data: BoardData,
    callback: (err: Error | null, reply: string) => void,
) => {
    const cachedData: RedisLeaderboardPositions = {
        ...data,
        lastUpdate: new Date().getTime(),
    };

    client.set(marketMakerAddress, JSON.stringify(cachedData), callback);
};

app.get("/leaderboard/:marketMakerAddress", async (req, res) => {
    const { marketMakerAddress } = req.params;
    console.log("marketMakerAddress", marketMakerAddress);

    client.get(marketMakerAddress, async (_err, reply) => {
        if (!reply) {
            console.log("Talking to subgraph");

            const data = await getLeaderboardData(marketMakerAddress);
            if (!data) {
                console.log("No data found");
                return res.status(404).send({ status: "Not Found" });
            }

            console.log("!reply data");
            updateCache(marketMakerAddress, data, redis.print);
            return res.json(data);
        }

        const data: RedisLeaderboardPositions = JSON.parse(reply);
        res.json(data);

        // Update if expired
        if (
            !data.lastUpdate ||
            data.lastUpdate + CACHE_TTL < new Date().getTime()
        ) {
            // Update cache with current data then overwrite
            // This avoids re-fetching tens of times
            updateCache(marketMakerAddress, data, async () => {
                console.log(
                    "Data Reupdate in bg marketMakerAddress",
                    marketMakerAddress,
                );
                // Update the data secretly
                const newData = await getLeaderboardData(marketMakerAddress);
                updateCache(marketMakerAddress, newData, redis.print);
            });
        }
    });
});
const updateGlobalCache = (
    data: BoardData,
    callback: (err: Error | null, reply: string) => void,
) => {
    const cachedData: RedisLeaderboardPositions = {
        ...data,
        lastUpdate: new Date().getTime(),
    };

    client.set("globalLeaderboard", JSON.stringify(cachedData), callback);
};

app.get("/globalLeaderboard", async (req, res) => {
    client.get("globalLeaderboard", async (_err, reply) => {
        if (!reply) {
            console.log("Talking to subgraph");

            const data = await getGlobalLeaderboardData();
            if (!data) {
                console.log("No data found");
                return res.status(404).send({ status: "Not Found" });
            }

            console.log("!reply data");
            updateGlobalCache(data, redis.print);
            return res.json(data);
        }

        const data: RedisLeaderboardPositions = JSON.parse(reply);
        res.json(data);

        // Update if expired
        if (
            !data.lastUpdate ||
            data.lastUpdate + CACHE_TTL < new Date().getTime()
        ) {
            // Update cache with current data then overwrite
            // This avoids re-fetching tens of times
            updateGlobalCache(data, async () => {
                console.log("Data Reupdate in global board");
                // Update the data secretly
                const newData = await getGlobalLeaderboardData();
                updateGlobalCache(newData, redis.print);
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
