import express from "express";
import morgan from "morgan";
import cors from 'cors';
import cookieParser from "cookie-parser";
import axios from "axios";

import { port } from "./var.js";
import router from "./routes/index.js";

const app = express();

let corsOptions = {
    origin: "*",
    credentials: true,
    exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("short"));
app.use(cookieParser());

app.use('/public', express.static('public'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// DON'T REPLACE ALL ABOVE CODE
////////////////////////////////////////////////////////////////////////////////

// TODO BELOW
app.use('/', router);
