const axios = require("axios");

const AI_SERVICE_URL = "http://localhost:8000/process";

exports.processWithAI = async (filePath) => {
    try {
        const response = await axios.post(AI_SERVICE_URL, {
            file_path: filePath
        });

        return response.data;

    } catch (error) {
        console.error("AI Service Error:", error.message);
        throw new Error("Failed to process with AI service");
    }
};