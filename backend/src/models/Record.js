const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
    patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
    },
    filePath: {
        type: String,
        required: true
    },

    rawText: {
        type: String
    },

    structuredData: {
        diseases: [String],
        medicines: [String],
        dosage: [String],
        frequency: [String],
        duration: [String]
    },
    drugAlerts : {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Record", RecordSchema);