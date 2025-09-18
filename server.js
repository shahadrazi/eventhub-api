import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 3000;

// Path setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataFile = path.join(__dirname, "data", "students.json");

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read students.json
function readStudents() {
  try {
    const data = fs.readFileSync(dataFile, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

// Helper function to write to students.json
function writeStudents(students) {
  fs.writeFileSync(dataFile, JSON.stringify(students, null, 2));
}

// ✅ Task 1: Add a new student (POST)
app.post("/api/students", (req, res) => {
  const { name, age, course, year, status } = req.body;

  // Validation
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Name, course, and year are required." });
  }
  if (!age || isNaN(age) || age <= 0) {
    return res.status(400).json({ error: "Age must be a number greater than 0." });
  }

  const students = readStudents();

  const newStudent = {
    id: uuidv4(), // Unique ID
    name,
    age,
    course,
    year,
    status: status || "active",
  };

  students.push(newStudent);
  writeStudents(students);

  res.status(201).json(newStudent);
});

// ✅ Task 2: Get all students (GET)
app.get("/api/students", (req, res) => {
  try {
    const students = readStudents();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Could not read student data." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
