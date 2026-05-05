const express = require("express");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const patientRoutes = require("./routes/patientRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", uploadRoutes);
app.use("/api", patientRoutes);

module.exports = app;