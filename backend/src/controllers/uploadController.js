const { processWithAI } = require("../services/aiService");
const Record = require("../models/Record");
const Patient = require("../models/Patient");
const path = require("path");

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;
        const patientId = req.body.patientId;

        if (!file) {
            return res.status(400).json({
                message: "No file uploaded"
            });
        }

        if (!patientId) {
            return res.status(400).json({
                message: "Patient ID is required"
            });
        }

        const patientExists = await Patient.findById(patientId);

        if (!patientExists) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const filePath = path.resolve(file.path);

        const aiResult = await processWithAI(filePath);

        const newRecord = new Record({
            patientId,
            filePath,
            rawText: aiResult.raw_text,
            structuredData: aiResult.structured_data,
            drugAlerts: aiResult.drug_alerts
        });

        await newRecord.save();

        res.status(201).json({
            message: "File processed and saved successfully",
            data: newRecord
        });

    } catch (error) {
        res.status(500).json({
            message: "Upload processing failed",
            error: error.message
        });
    }
};