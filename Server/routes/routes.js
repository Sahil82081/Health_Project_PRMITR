import express from "express";
import chatController from "../controller/chatController.js";
import scannerController from "../controller/scannerController.js";
import upload from "../middleware/upload.js";

const route = express.Router();

route.post("/chatBot", chatController.handleChat);
route.post("/chatbot", chatController.handleChat);
route.post("/predict", chatController.predictDisease);

route.post("/analyze", upload.single("image"), scannerController.analyzeImage);


route.get("/status", (req, res) => {
    res.json({ status: "Server is running" });
});

export default route;