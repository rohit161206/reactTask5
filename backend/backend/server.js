const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const db = require("./src/config/db"); // Import database connection

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());

// ✅ Test Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// ✅ Add Data (POST API)
app.post("/add-data", (req, res) => {
    const { subject1, subject2, subject3, subject4 } = req.body;
    
    if (!subject1 || !subject2 || !subject3 || !subject4) {
        return res.status(400).json({ error: "All subjects are required!" });
    }

    const query = `INSERT INTO data (subject1, subject2, subject3, subject4) VALUES (?, ?, ?, ?)`;

    db.query(query, [subject1, subject2, subject3, subject4], (err) => {
        if (err) {
            console.error("Error inserting data:", err);
            return res.status(500).json({ error: "Failed to add marks" });
        }

        res.status(200).json({ message: "Marks inserted successfully" });
    });
});

// ✅ Fetch Data (GET API)
app.get("/get-data", (req, res) => {
    const query = "SELECT * FROM data";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch data" });
        }
        res.status(200).json(results);
    });
});


// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
