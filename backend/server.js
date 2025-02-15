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

    // ✅ Ensure all fields are received
    if (!subject1 || !subject2 || !subject3 || !subject4) {
        console.error("❌ Missing fields in request body:", req.body);
        return res.status(400).json({ error: "All subjects are required!" });
    }

    // ✅ Insert data WITHOUT using `id` (Database should auto-generate it)
    const query = `INSERT INTO data (subject1, subject2, subject3, subject4) VALUES (?, ?, ?, ?)`;

    db.query(query, [subject1, subject2, subject3, subject4], (err, result) => {
        if (err) {
            console.error("❌ Database Insertion Error:", err);
            return res.status(500).json({ error: "Failed to add marks" });
        }

        console.log("✅ Marks inserted successfully with ID:", result.insertId);
        res.status(200).json({ message: "Marks inserted successfully", id: result.insertId });
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

// ✅ Update Data (PUT API)
app.put("/update-data/:id", (req, res) => {
    const { id } = req.params;
    const { subject1, subject2, subject3, subject4 } = req.body;

    if (!subject1 || !subject2 || !subject3 || !subject4) {
        return res.status(400).json({ error: "All subjects are required!" });
    }

    const query = `UPDATE data SET subject1=?, subject2=?, subject3=?, subject4=? WHERE id=?`;

    db.query(query, [subject1, subject2, subject3, subject4, id], (err) => {
        if (err) {
            console.error("Error updating data:", err);
            return res.status(500).json({ error: "Failed to update marks" });
        }

        res.status(200).json({ message: "Marks updated successfully" });
    });
});

// ✅ Delete Data (DELETE API)
app.delete("/delete-data/:id", (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM data WHERE id=?`;

    db.query(query, [id], (err) => {
        if (err) {
            console.error("Error deleting data:", err);
            return res.status(500).json({ error: "Failed to delete entry" });
        }

        res.status(200).json({ message: "Entry deleted successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
