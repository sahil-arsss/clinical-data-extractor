const express = require("express");
const router = express.Router();
const {
    createPatient,
    getPatientTimeline,
    searchRecords
} = require("../controllers/patientController");

router.post("/patient", createPatient);
router.get("/patient/:patientId/timeline", getPatientTimeline);
router.get("/search", searchRecords);

module.exports = router;