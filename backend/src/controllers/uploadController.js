const path = require("path");

exports.uploadFile = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        res.json({
            message: "File uploaded successfully",
            filePath: file.path
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};