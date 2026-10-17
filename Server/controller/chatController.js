import sessions from "../services/sessionstorage.js";
import { askGemini } from "../services/geminiService.js";
import axios from "axios";

const handleChat = async (req, res) => {
    const { sessionId, message } = req.body;

    if (!sessions[sessionId]) {
        sessions[sessionId] = {
            symptoms: [],
            chatHistory: [],
            lastQuestion: ""
        };
    }
    const session = sessions[sessionId];

    // Save user message
    session.chatHistory.push({
        role: "user",
        text: message
    });

    // Ask Gemini
    const result = await askGemini(session, message);
    // Save symptoms
    result.newSymptoms.forEach(symptom => {
        if (!session.symptoms.includes(symptom)) {
            session.symptoms.push(symptom);
        }
    });
    console.log("Session after processing:", session);
    // Save bot question
    session.lastQuestion = result.question;
    session.chatHistory.push({
        role: "assistant",
        text: result.question
    });

    console.log("Session after processing:", session);
    // Enough symptoms?
    if (result.completed) {
        return res.json({
            completed: true,
            symptoms: session.symptoms
        });

    }
    return res.json({
        completed: false,
        question: result.question,
        symptoms: session.symptoms
    });

}

const predictDisease = async (req, res) => {
    try {
        const { symptoms } = req.body;
        const mlBaseUrl = (process.env.ML_API_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

        const response = await axios.post(
            `${mlBaseUrl}/predict`,
            {
                symptoms,
            }
        );
        console.log("Prediction response:", response.data);
        res.json(response.data);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Prediction failed",
        });
    }
}

export default {
    handleChat,
    predictDisease
}