import express from "express";
import {PORT} from "./config.js";
import userRoutes from './routes/users.routes.js';
import morgan from "morgan";
import cors from "cors";
import generalRoutes from './routes/general.routes.js';

const corsOptions = {
    origin: "http://localhost:5173",
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHearders: ["Content-Type"],
    credentials: true,
};



const app = express();

app.use(cors(corsOptions));
app.options("*",cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(morgan('dev'));
app.use(express.json());
app.use("/api",userRoutes);
app.use("/api",generalRoutes);
app.listen(PORT);
console.log('server on port ',PORT);


