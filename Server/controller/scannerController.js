
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const analyzeImage = async (req, res) => {

    console.log("========== ANALYZE START ==========");

    if (!req.file) {
        console.log("NO FILE RECEIVED");

        return res.status(400).json({
            success: false,
            message: "No image uploaded"
        });
    }

    console.log("Image:", req.file.path);

    try {

        console.log("1. Creating FormData");

        const form = new FormData();

        console.log("2. Creating read stream");

        const stream = fs.createReadStream(req.file.path);

        console.log("3. Appending image");

        form.append("file", stream);

        console.log("4. Sending request to FastAPI");

        const mlBaseUrl = (process.env.ML_API_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

        const response = await axios.post(
            `${mlBaseUrl}/predict-image`,
            form,
            {
                headers: {
                    ...form.getHeaders()
                }
            }
        );

        console.log("5. FastAPI responded");
        console.log("Status:", response.status);
        console.log("Data:", response.data);

        if (!response.data.success) {

            console.log("FastAPI returned failure");

            return res.status(500).json({
                success: false,
                message: response.data.error || "ML prediction failed"
            });
        }

        const prediction = response.data.prediction;

        console.log("6. Prediction:", prediction);

        return res.status(200).json({
            success: true,
            condition: prediction.condition,
            confidence: prediction.confidence
        });

    } catch (err) {

        console.error("========== ERROR ==========");
        console.error("Error message:", err.message);
        console.error("Error stack:", err.stack);
        console.error("Axios response:", err.response?.data);
        console.error("Axios status:", err.response?.status);
        console.error("===========================");

        return res.status(500).json({
            success: false,
            message: "Image prediction failed",
            error: err.message
        });

    } finally {

        console.log("7. Cleaning uploaded image");

        if (req.file?.path) {

            fs.unlink(req.file.path, (err) => {

                if (err) {
                    console.error(
                        "Failed to delete uploaded image:",
                        err.message
                    );
                } else {
                    console.log(
                        "Uploaded image deleted:",
                        req.file.path
                    );
                }

            });
        }

        console.log("========== ANALYZE END ==========");
    }
};

export default {
    analyzeImage
};