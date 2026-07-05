import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// ================================
// Path Configuration
// ================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend files from Sprint-4 root
app.use(express.static(path.join(__dirname, "..")));

// ================================
// Middleware
// ================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================================
// Multer Configuration
// ================================

const upload = multer({
    dest: "uploads/",
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// ================================
// Gemini Configuration
// ================================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// ================================
// Home Route
// ================================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// ================================
// Generate Cover Letter
// ================================

app.post("/generate", upload.single("resume"), async (req, res) => {

    console.log("📩 /generate called");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    try {

        const { name, role, company, skills } = req.body;

        if (!name || !role || !company || !skills) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        let resumeInfo = "";

        if (req.file) {
            resumeInfo = `Resume uploaded: ${req.file.originalname}`;
            console.log(resumeInfo);
        }

        const prompt = `
You are an experienced HR recruiter.

Write a professional ATS-friendly cover letter.

Candidate Name: ${name}
Job Role: ${role}
Target Company: ${company}
Key Skills: ${skills}

${resumeInfo}

Instructions:
- Keep the cover letter between 250 and 350 words.
- Use a professional tone.
- Personalize it for ${company}.
- Mention the candidate's skills naturally.
- Do not use placeholders.
- Start with today's date.
- Address the hiring manager professionally.
- End politely with:

Sincerely,
${name}

Return ONLY the cover letter.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const letter =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated.";

        res.json({
            success: true,
            letter
        });

    } catch (error) {

        console.error("❌ Gemini Error:", error);

        res.status(500).json({
            success: false,
            message: error.message || "Unable to generate cover letter."
        });

    }

});

// ================================
// 404 Handler
// ================================

app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

// ================================
// Start Server
// ================================

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});