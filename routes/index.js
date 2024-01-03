import express from "express";
import api from "../api.js";
import { getChampion, getGameMode, getSpell } from "../var.js";

const router = express.Router();

const getPlayer = async (player) => {
    const {
        championId, championName, champLevel,
        riotIdGameName, riotIdTagline,
        deaths, kills, assists,
        totalMinionsKilled, goldEarned,
        lane,
        summoner1Id, summoner2Id,
        win,
    } = player;
    const items = [];
    for (let j = 0; j < 7; j++) {
        items.push(player[`item${j}`] ? `https://ddragon.leagueoflegends.com/cdn/${api.version}/img/item/${player[`item${j}`]}.png` : null);
    }
    const spell1 = await getSpell(summoner1Id);
    const spell2 = await getSpell(summoner2Id);

    return {
        riotIdGameName, riotIdTagline,
        championId, championName, champLevel,
        champImg: `${api.cdn}/${api.version}/img/champion/${championName}.png`,
        deaths, kills, assists,
        totalMinionsKilled, goldEarned,
        items,
        lane,
        spell1: `${api.cdn}/${api.version}/img/spell/${spell1.image.full}`,
        spell2: `${api.cdn}/${api.version}/img/spell/${spell2.image.full}`,
        win,
    }
}

router.get("/match/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const match = await api.get('sea', `/lol/match/v5/matches/${id}`);
        const { gameDuration, gameCreation, gameId, queueId, participants } = match.info;
        const { gameMode, gameType } = await getGameMode(queueId);
        let k1 = 0, k2 = 0, d1 = 0, d2 = 0, a1 = 0, a2 = 0;
        const players = [];
        for (let i = 0; i < participants.length; i++) {
            const p = await getPlayer(participants[i]);
            players.push(p)
        }
        const newPlayer = [];
        for (let i = 0; i < 5; i++) {
            k1 += players[i].kills; k2 += players[i + 5].kills;
            d1 += players[i].deaths; d2 += players[i + 5].deaths;
            a1 += players[i].assists; a2 += players[i + 5].assists;
            newPlayer.push([players[i], players[i + 5]]);
        }
        const win = players[0].win ? 0 : 1;
        res.json({
            win,
            players: newPlayer,
            gameDuration, gameCreation, gameId, gameMode, gameType,
            sumary: [{ k: k1, d: d1, a: a1 }, { k: k2, d: d2, a: a2 }]
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});

router.get("/profile/info/:gameName", async (req, res) => {
    try {
        const { gameName } = req.params;
        const arr = gameName.split('#');
        const info = await api.get(`asia`, `/riot/account/v1/accounts/by-riot-id/${arr[0]}/${arr[1]}`);
        const { puuid } = info;
        const data = await api.get('vn2', `/lol/summoner/v4/summoners/by-puuid/${puuid}`);

        const { id: summonerId } = data;

        let mastery = await api.get('vn2', `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top`);
        const order = [1, 0, 2];
        let newMastery = [];
        for (let i = 0; i < order.length; i++) {
            let champ = await getChampion(mastery[order[i]].championId);
            newMastery.push({
                id: mastery[order[i]].championId,
                name: champ.id,
                points: mastery[order[i]].championPoints,
                level: mastery[order[i]].championLevel,
                img: `https://ddragon.leagueoflegends.com/cdn/${champ.version}/img/champion/${champ.image.full}`
            });
        }
        data.profileImg = `https://ddragon.leagueoflegends.com/cdn/${api.version}/img/profileicon/${data.profileIconId}.png`;
        res.json({ ...data, name: gameName})
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
})

router.get("/profile/mastery/:puuid", async (req, res) => {
    try {
        const { puuid } = req.params;
        let mastery = await api.get('vn2', `/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top`);
        const order = [1, 0, 2];
        let newMastery = [];
        for (let i = 0; i < order.length; i++) {
            let champ = await getChampion(mastery[order[i]].championId);
            newMastery.push({
                id: mastery[order[i]].championId,
                name: champ.id,
                points: mastery[order[i]].championPoints,
                level: mastery[order[i]].championLevel,
                img: `https://ddragon.leagueoflegends.com/cdn/${champ.version}/img/champion/${champ.image.full}`
            });
        }

        res.json(newMastery)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.get("/profile/rank/:summonerId", async (req, res) => {
    try {
        const { summonerId } = req.params;
        let rank = await api.get('vn2', `/lol/league/v4/entries/by-summoner/${summonerId}`);

        for (let i = 0; i < rank.length; i++) {
            const capitalizeFirstLetter = (str) => {
                str = str.toLowerCase();
                return str.charAt(0).toUpperCase() + str.slice(1);
            }
            const convert = str => {
                if (str == "RANKED_FLEX_SR") return "Linh hoạt";
                else if (str == "RANKED_SOLO_5x5") return "Đơn/Đôi";
            }
            const vietnam = (str) => {
                if (str == 'IRON') return "SẮT";
                if (str == 'BRONE') return "ĐỒNG";
                if (str == 'SILVER') return "BẠC";
                if (str == 'GOLD') return "VÀNG";
                if (str == 'PLATINUM') return "BẠCH KIM";
                if (str == 'EMERALD') return "LỤC BẢO";
                if (str == 'DIAMOND ') return "KIM CƯƠNG";
                if (str == 'MASTER') return "CAO THỦ";
                if (str == 'CHALLENGER') return "THÁCH ĐẤU";
            }
            rank[i] = {
                img: capitalizeFirstLetter(rank[i].tier),
                title: `${vietnam(rank[i].tier)} ${rank[i].rank}`,
                score: rank[i].leaguePoints,
                type: convert(rank[i].queueType)
            };
        }

        res.json(rank)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

router.get("/profile/histories/:puuid", async (req, res) => {
    try {
        const { puuid } = req.params;
        let histories = await api.get('sea', `/lol/match/v5/matches/by-puuid/${puuid}/ids?count=5`);
        for (let i = 0; i < histories.length; i++) {
            const h = await api.get('sea', `/lol/match/v5/matches/${histories[i]}`);
            const { gameDuration, gameCreation, queueId } = h.info;
            const { gameMode, gameType } = await getGameMode(queueId);
            const player = h.info.participants.find(p => p.puuid == puuid);
            const p = await getPlayer(player);
            histories[i] = {
                ...p,
                matchId: histories[i],
                gameMode, gameType,
                gameDuration, gameCreation,
            };
        }
        res.json(histories)
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})
export default router;