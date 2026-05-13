const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
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

        drugAlerts: {
            type: [String],
            default: []
        }
    },
    {
        timestamps: true
    }
);

RecordSchema.index({ patientId: 1, createdAt: -1 });
RecordSchema.index({ "structuredData.medicines": 1 });
RecordSchema.index({ "structuredData.diseases": 1 });

module.exports = mongoose.model("Record", RecordSchema);