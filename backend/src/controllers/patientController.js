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

        const records = await Record.find({ patientId })
            .sort({ createdAt: 1 });

        const timeline = records.map(record => ({
            date: record.createdAt,
            diseases: record.structuredData.diseases,
            medicines: record.structuredData.medicines
        }));

        res.json({
            patientId,
            timeline
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.searchRecords = async (req, res) => {
    try {
        const { disease, medicine } = req.query;

        let query = {};

        if (disease) {
            query["structuredData.diseases"] = disease;
        }

        if (medicine) {
            query["structuredData.medicines"] = medicine;
        }

        const results = await Record.find(query);

        res.json(results);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};