import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "../routes/routes.js";


const app = express();
const PORT = 8000;

const allowedOrigins = process.env.DOMAINS.split(",");
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("Welcome To My Server");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});