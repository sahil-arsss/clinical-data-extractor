const express = require("express");
const router = express.Router();
const {
    createPatient,
    getPatientTimeline
} = require("../controllers/patientController");

router.post("/patient", createPatient);
router.get("/patient/:patientId/timeline", getPatientTimeline);

module.exports = router;