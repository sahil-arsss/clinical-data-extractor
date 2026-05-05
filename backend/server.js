const app = require("./src/app");
const connectDB = require("./src/config/db");

connectDB();

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




// uvicorn app.main:app --reload --port 8000 