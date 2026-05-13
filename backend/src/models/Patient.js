const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Patient", PatientSchema);