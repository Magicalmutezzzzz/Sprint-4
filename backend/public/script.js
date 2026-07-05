// ===========================================
// AI Cover Letter Generator
// script.js
// ===========================================

// DOM Elements
const form = document.getElementById("coverLetterForm");
const output = document.getElementById("output");
const loading = document.getElementById("loading");

const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

const resumeInput = document.getElementById("resume");

// Backend URL
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8000/generate"
        : "/generate";

// Store Generated Letter
let generatedLetter = "";

// ===========================================
// Generate Cover Letter
// ===========================================

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const role = document.getElementById("role").value.trim();
    const company = document.getElementById("company").value.trim();
    const skills = document.getElementById("skills").value.trim();

    if (!name || !role || !company || !skills) {

        alert("Please fill all required fields.");

        return;

    }

    loading.classList.remove("hidden");

    output.innerHTML = "";

    generateBtn.disabled = true;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;

    try {

        const formData = new FormData();

        formData.append("name", name);
        formData.append("role", role);
        formData.append("company", company);
        formData.append("skills", skills);

        if (resumeInput.files.length > 0) {

            formData.append("resume", resumeInput.files[0]);

        }

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });

        const result = await response.json();

        if (!response.ok || !result.success) {

            throw new Error(
                result.message || "Unable to generate cover letter."
            );

        }

        generatedLetter = result.letter;

        output.innerHTML = `
            <pre>${generatedLetter}</pre>
        `;

        copyBtn.disabled = false;
        downloadBtn.disabled = false;

    }

    catch (error) {

        console.error(error);

        output.innerHTML = `
            <div style="
                color:#dc2626;
                padding:20px;
                font-weight:600;
                line-height:1.8;
            ">
                ❌ ${error.message}
            </div>
        `;

    }

    finally {

        loading.classList.add("hidden");

        generateBtn.disabled = false;

    }

});

// ===========================================
// Copy Cover Letter
// ===========================================

copyBtn.addEventListener("click", async () => {

    if (!generatedLetter) return;

    try {

        await navigator.clipboard.writeText(generatedLetter);

        copyBtn.textContent = "✓ Copied";

        setTimeout(() => {

            copyBtn.textContent = "Copy";

        }, 2000);

    }

    catch {

        alert("Unable to copy text.");

    }

});

// ===========================================
// Download PDF
// ===========================================

downloadBtn.addEventListener("click", () => {

    if (!generatedLetter) return;

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const candidateName =
        document.getElementById("name").value.trim() || "Candidate";

    doc.setFont("Times", "Bold");
    doc.setFontSize(18);

    doc.text("AI Generated Cover Letter", 20, 20);

    doc.setFont("Times", "Normal");
    doc.setFontSize(10);

    doc.text(
        `Generated on: ${new Date().toLocaleString()}`,
        20,
        30
    );

    doc.setFontSize(12);

    const lines = doc.splitTextToSize(
        generatedLetter,
        170
    );

    doc.text(lines, 20, 45);

    doc.save(
        `${candidateName.replace(/\s+/g, "_")}_Cover_Letter.pdf`
    );

});

// ===========================================
// Reset Form
// ===========================================

form.addEventListener("reset", () => {

    generatedLetter = "";

    output.innerHTML = `
        <p class="placeholder">
            Your generated cover letter will appear here...
        </p>
    `;

    copyBtn.disabled = true;
    downloadBtn.disabled = true;

});

// ===========================================
// Resume Upload Validation
// ===========================================

resumeInput.addEventListener("change", () => {

    if (!resumeInput.files.length) return;

    const file = resumeInput.files[0];

    if (file.type !== "application/pdf") {

        alert("Only PDF files are allowed.");

        resumeInput.value = "";

        return;

    }

    if (file.size > 5 * 1024 * 1024) {

        alert("Maximum file size is 5 MB.");

        resumeInput.value = "";

        return;

    }

    console.log("Resume Selected:", file.name);

});