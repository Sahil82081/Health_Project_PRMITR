import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import routes from "../routes/routes.js";


const app = express();
const PORT = process.env.PORT || 8000;

const allowedOrigins = process.env.DOMAINS
    ? process.env.DOMAINS.split(",").map((domain) => domain.trim()).filter(Boolean)
    : ["http://localhost:5173"];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS: ${origin}`));
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

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server started on port ${PORT} (0.0.0.0)`);
});