import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const apiKey = process.env.API_KEY;
export const port = 8800;

export const realms = async () => {
    const { data } = await axios.get(`http://ddragon.leagueoflegends.com/realms/vn.json`);
    return data;
}

export const champions = async () => {
    const r = await realms();
    const { data } = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${r.v}/data/${r.l}/champion.json`);
    return data;
}


export const getChampion = async id => {
    const {data} = await champions();
    const champ = Object.values(data).find(c => c.key == id);
    return champ;
}

export const spells = async () => {
    const r = await realms();
    const { data } = await axios.get(`http://ddragon.leagueoflegends.com/cdn/${r.v}/data/${r.l}/summoner.json`);
    return data;
}


export const getSpell = async id => {
    const {data} = await spells();
    const spell = Object.values(data).find(c => c.key == id);
    return spell;
}

export const getGameMode = async (id) => {
    const { data } = await axios.get(`http://static.developer.riotgames.com/docs/lol/queues.json`);
    const queue = data.find(d => d.queueId == id);
    switch (queue.description) {
        case "5v5 Ranked Solo games":
            return {gameMode: 'Xếp Hạng', gameType: 'Đơn/Đôi'};
        case "5v5 Ranked Flex games":
            return {gameMode: 'Xếp Hạng', gameType: 'Linh hoạt'};
        case "5v5 Blind Pick games":
            return {gameMode: 'Đấu Thường', gameType: 'Chọn ẩn'};
        case "Normal (Quickplay)":
            return {gameMode: 'Đấu Thường', gameType: 'Chọn nhanh'};
        case "5v5 Draft Pick games":
            return {gameMode: 'Đấu Thường', gameType: 'Cấm/Chọn'};
        case "5v5 ARAM games":
            return { gameMode: 'ARAM', gameType: '' };
        case "Arena":
            return {gameMode: 'Võ Đài', gameType: ''};
        default:
            return {gameMode: 'Không rõ', gameType: ''};
    }
}