const { processWithAI } = require("../services/aiService");
const Record = require("../models/Record");
const path = require("path");

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const filePath = path.resolve(file.path);;

        const aiResult = await processWithAI(filePath);

     
        const newRecord = new Record({
            filePath,
            rawText: aiResult.raw_text,
            structuredData: aiResult.structured_data
        });

        await newRecord.save();

        res.json({
            message: "File processed & saved successfully",
            data: newRecord
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};