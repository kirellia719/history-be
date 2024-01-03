import axios from 'axios';
import { apiKey, realms } from './var.js';

axios.defaults.headers['X-Riot-Token'] = apiKey;

class API {
    constructor() {
        const fetchVersion = async () => {
            try {
                const r = await realms();
                this.version = r.v;
                this.language = r.l;
                this.cdn = r.cdn;
            } catch (error) {
                console.log(error);
            }
        }   
        fetchVersion();
    }

    async get(region, url) {
        const { data } = await axios.get(`https://${region}.api.riotgames.com${url}`);
        return data;
    }
}

export default new API();
