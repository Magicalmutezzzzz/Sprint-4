# 🤖 AI Cover Letter Generator

An AI-powered web application that generates professional, ATS-friendly cover letters using Google's Gemini AI. Users can enter their personal details, upload a resume (PDF), and instantly generate customized cover letters with options to copy or download them as a PDF.

---

## 🚀 Live Demo

### Frontend (Vercel)
https://sprint-4-pi.vercel.app/

### Backend (Render)
https://ai-generated-cover-letter.onrender.com/

---

## ✨ Features

- 🤖 AI-powered cover letter generation using Gemini AI
- 📄 Upload Resume (PDF)
- 📝 Automatically extracts resume text using PDF.js
- 💼 Generates ATS-friendly professional cover letters
- 📋 Copy generated cover letter to clipboard
- 📥 Download cover letter as PDF
- 🌙 Dark Mode support
- 💾 Auto-save form data using Local Storage
- 📱 Fully responsive design
- 🎨 Modern Glassmorphism UI

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6)
- PDF.js
- jsPDF
- Font Awesome

### Backend

- Node.js
- Express.js
- Google Gemini API
- CORS
- dotenv

### Deployment

- Vercel (Frontend)
- Render (Backend)

---

## 📂 Project Structure

```
Sprint-4/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env
│
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Magicalmutezzzzz/Sprint-4.git
```

### 2. Navigate to Backend

```bash
cd Sprint-4/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Create Environment Variable

Create a `.env` file inside the backend folder.

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
PORT=8000
```

---

## ▶️ Run Backend

```bash
npm start
```

Backend runs on

```
http://localhost:8000
```

---

## 🌐 Run Frontend

Open `index.html` using VS Code Live Server or any local web server.

---

## 📡 API Endpoint

### POST `/generate`

Generates a professional cover letter.

### Request Body

```json
{
  "name": "John Doe",
  "role": "Frontend Developer",
  "company": "Google",
  "skills": "HTML, CSS, JavaScript, React",
  "resume": "Extracted Resume Text"
}
```

### Response

```json
{
  "success": true,
  "letter": "Generated Cover Letter..."
}
```

---

## 📸 Screenshots

### Home Page

- Glassmorphism User Interface
- Responsive Two-Panel Layout
- Resume Upload
- AI Generated Cover Letter

---

## 🔒 Environment Variables

| Variable | Description |
|----------|-------------|
| GEMINI_API_KEY | Google Gemini API Key |
| PORT | Backend Port |

---

## 📦 Dependencies

### Backend

- express
- cors
- dotenv
- @google/genai

### Frontend

- PDF.js
- jsPDF
- Font Awesome

---

## 💡 Future Improvements

- Multiple cover letter templates
- Resume ATS Score
- AI Resume Analysis
- Multi-language support
- DOCX Download
- Authentication
- Cover Letter History
- User Dashboard

---

## 👨‍💻 Author

**Karamveer Singh**

LinkedIn:
https://www.linkedin.com/in/karamveer340

GitHub:
https://github.com/Magicalmutezzzzz

---

## 📄 License

This project is developed for educational and learning purposes.

---

## ⭐ If you like this project

Give this repository a ⭐ on GitHub and feel free to contribute or suggest improvements.
