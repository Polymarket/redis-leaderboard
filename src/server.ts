import redis from "redis";
import express from "express";
import cors from "cors";
import getLeaderBoardData, { getLeaderboardData } from "./getLeaderboardData";
import { LeaderBoardPosition } from "./utils";

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;

app.get("/:marketMakerAddress", async (req, res) => {
    const { marketMakerAddress } = req.params;
    const data = await getLeaderboardData(marketMakerAddress);
    res.send(data);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
