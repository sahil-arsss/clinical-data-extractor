const Patient = require("../models/Patient");
const Record = require("../models/Record");

// Create patient
exports.createPatient = async (req, res) => {
    try {
        const patient = new Patient(req.body);
        await patient.save();

        res.json(patient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get patient timeline
exports.getPatientTimeline = async (req, res) => {
    try {
        const { patientId } = req.params;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const records = await Record.find({ patientId })
            .sort({ createdAt: 1 });

        const timeline = records.map(record => ({
            recordId: record._id,
            date: record.createdAt,
            filePath: record.filePath,
            diseases: record.structuredData.diseases,
            medicines: record.structuredData.medicines,
            dosage: record.structuredData.dosage,
            frequency: record.structuredData.frequency,
            duration: record.structuredData.duration,
            drugAlerts: record.drugAlerts
        }));

        res.json({
            patient,
            timeline
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient timeline",
            error: error.message
        });
    }
};

exports.searchRecords = async (req, res) => {
    try {
        const { disease, medicine } = req.query;

        let query = {};

        if (disease) {
            query["structuredData.diseases"] = {
                $regex: disease,
                $options: "i"
            };
        }

        if (medicine) {
            query["structuredData.medicines"] = {
                $regex: medicine,
                $options: "i"
            };
        }

        const results = await Record.find(query)
            .populate("patientId", "name age gender")
            .sort({ createdAt: -1 });

        res.json(results);

    } catch (error) {
        res.status(500).json({
            message: "Search failed",
            error: error.message
        });
    }
};