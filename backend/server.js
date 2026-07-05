import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer configuration
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Home Route
app.get("/", (req, res) => {
  res.send("Backend Running 🚀");
});

// Generate Cover Letter
app.post("/generate", upload.single("resume"), async (req, res) => {

    console.log("📩 /generate called");
    console.log("Body:", req.body);
    console.log("File:", req.file);

    try {

        const { name, role, company, skills } = req.body;

        // Validate required fields
        if (!name || !role || !company || !skills) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        // Optional: Check if resume was uploaded
        let resumeInfo = "";

        if (req.file) {
            resumeInfo = `Resume uploaded: ${req.file.originalname}`;
            console.log(resumeInfo);
        }

        // Prompt
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
- End with:

Sincerely,
${name}

Return ONLY the cover letter.
`;

        // Gemini API Call
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        const letter =
            response.text ||
            response.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated.";

        res.status(200).json({
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

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});