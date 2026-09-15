import dotenv from "dotenv";
dotenv.config();
import { GoogleGenAI } from "@google/genai";
import { loadSymptoms } from "../data/handledata.js";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


export async function askGemini(session, userMessage) {
    const validSymptoms = await loadSymptoms();

    const prompt = `
You are a medical symptom collection assistant.

Conversation History:
${JSON.stringify(session.chatHistory)}

Already Collected Symptoms:
${JSON.stringify(session.symptoms)}

Valid Symptoms:
${JSON.stringify(validSymptoms)}

Last Question:
${session.lastQuestion}

Latest User Message:
${userMessage}

Rules:

1. Understand the user's latest answer.

2. If the answer is "Yes", add the symptom related to the last question.

3. If the answer is "No", do not add that symptom.

4. Extract every symptom mentioned by the user.

5. Match every extracted symptom to ONLY ONE symptom from the Valid Symptoms list.

6. Correct spelling mistakes before matching.
Examples:
- fevr → fever
- head ache → headache
- tummy pain → stomach_pain

7. If the user uses a synonym, map it to the closest valid symptom.
Examples:
- high temperature → fever
- stomach ache → stomach_pain
- body ache → muscle_pain (if present in Valid Symptoms)

8. Never create or return a symptom that is not present in the Valid Symptoms list.

9. Remove duplicate symptoms.

10. If no confident match exists for a symptom, ignore it.

11. If the total collected symptoms are less than 7, ask ONLY ONE follow-up question about a symptom that is not already collected.

12. If there are already 7 or more symptoms, set completed=true and question="".

Return ONLY valid JSON in this format:

{
  "newSymptoms": [],
  "question": "",
  "completed": false
}
`;


    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt
    });

    let text = response.text;

    text = text.replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(text);
}