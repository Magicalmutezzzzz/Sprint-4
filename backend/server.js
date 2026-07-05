import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));
app.use(cors());
app.use(express.json());
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing!");
}
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post("/generate", async (req, res) => {
  try {
    console.log("Generate route called");
    console.log(req.body);
    const { name, role, company, skills, resume } = req.body;
    const prompt = `
Write a professional cover letter using the details below.
Candidate Name: ${name}
Job Role: ${role}
Company: ${company}
Skills: ${skills}
Resume: ${resume}
Instructions:
- Start directly with today's date.
- Address the hiring manager professionally.
- Use "${name}" as the candidate name.
- Use "${company}" as the company name.
- Use "${role}" as the job title.
- Do NOT use placeholders such as [Your Name], [Date], [Company], [Address], or [Platform].
- Write 250-350 words.
- End with:
Sincerely,
${name}
Return only the cover letter.
`;
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("Gemini Response:", result);
    const text =
      result.text ||
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated.";
    res.json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);

    res.status(500).json({
      text: error.message || "Failed to generate cover letter.",
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});