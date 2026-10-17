import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export function useSymptomChecker() {
    const [messages, setMessages] = useState([
        {
            sender: 'bot',
            timestamp: 'Just now',
            text: "Hello! I am HealthPulse AI, your clinical preliminary assistant. Select symptoms below or describe how you are feeling today.",
            structuredData: null
        }
    ]);

    const [inputQuery, setInputQuery] = useState("");
    const [isBotThinking, setIsBotThinking] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const chatBottomRef = useRef(null);
    const recognitionRef = useRef(null);

    const generateSessionId = () => crypto.randomUUID();
    const [sessionId, setSessionId] = useState(generateSessionId);

    const [symptoms, setSymptoms] = useState([]);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isBotThinking]);

    const handleSendMessage = async (textToSend = inputQuery) => {
        if (!textToSend.trim()) return;

        try {
            setMessages((prev) => [
                ...prev,
                {
                    sender: "user",
                    timestamp: 'Just now',
                    text: textToSend,
                },
            ]);
            setInputQuery("");
            setIsBotThinking(true);

            console.log(sessionId);
            const res = await axios.post(
                API_ENDPOINTS.CHATBOT,
                {
                    sessionId,
                    message: textToSend,
                }
            );

            console.log(res.data);

            if (!res.data.completed) {
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        text: res.data.question,
                        timestamp: 'Just now'
                    },
                ]);
            }

            setSymptoms(res.data.symptoms);
            setCompleted(res.data.completed);
            setIsBotThinking(false);
        } catch (error) {
            console.error(error);
            setIsBotThinking(false);
            setMessages((prev) => [
                ...prev,
                {
                    sender: "bot",
                    text: "Something went wrong. Please try again.",
                    timestamp: 'Just now'
                },
            ]);
        }
    };

    useEffect(() => {
        if (!completed) return;

        const predictDisease = async () => {
            try {
                const res = await axios.post(
                    API_ENDPOINTS.PREDICT,
                    {
                        symptoms,
                    }
                );
                setMessages((prev) => [
                    ...prev,
                    {
                        sender: "bot",
                        timestamp: "Just now",
                        text: "Prediction completed.",
                        structuredData: res.data.predictions,
                    },
                ]);
            } catch (err) {
                console.error(err);
            }
        };

        if (symptoms.length > 6) {
            predictDisease();
        }

    }, [completed]);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            let transcript = "";

            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }

            setInputQuery(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error(event.error);
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const handleVoiceToggle = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
        }
    };

    const handleClearChat = () => {
        setMessages([
            {
                sender: 'bot',
                timestamp: 'Just now',
                text: "Chat history cleared. I am ready for your next symptom inquiry.",
                structuredData: null
            }
        ]);
        setSymptoms([]);
        setCompleted(false);
        setSessionId(generateSessionId());
    };

    return {
        messages,
        inputQuery,
        setInputQuery,
        isBotThinking,
        isListening,
        chatBottomRef,
        handleSendMessage,
        handleVoiceToggle,
        handleClearChat
    };
}
