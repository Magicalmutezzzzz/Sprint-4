const form = document.getElementById("coverForm");

const nameInput = document.getElementById("name");

const roleInput = document.getElementById("role");

const companyInput = document.getElementById("company");

const skillsInput = document.getElementById("skills");

const resumeInput = document.getElementById("resume");

const output = document.getElementById("output");

const loading = document.getElementById("loading");

const copyBtn = document.getElementById("copyBtn");

const downloadBtn = document.getElementById("downloadBtn");

const resetBtn = document.getElementById("resetBtn");

const darkBtn = document.getElementById("darkModeBtn");

const toast = document.getElementById("toast");

const counter = document.getElementById("count");

// ---------------- Backend ----------------

const API_URL =

    window.location.hostname === "localhost"

        ? "http://localhost:8000/generate"

        : "https://ai-generated-cover-letter.onrender.com/generate";

// ---------------- Variables ----------------

let resumeText = "";

// ======================================================

// Theme

// ======================================================

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark");

}

darkBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark")

            ? "dark"

            : "light"

    );

});

// ======================================================

// Character Counter

// ======================================================

skillsInput.addEventListener("input", () => {

    counter.textContent =

        `${skillsInput.value.length} / 500`;

    saveData();

});

// ======================================================

// Local Storage

// ======================================================

function saveData(){

    localStorage.setItem("name",nameInput.value);

    localStorage.setItem("role",roleInput.value);

    localStorage.setItem("company",companyInput.value);

    localStorage.setItem("skills",skillsInput.value);

}

function loadData(){

    nameInput.value =

        localStorage.getItem("name") || "";

    roleInput.value =

        localStorage.getItem("role") || "";

    companyInput.value =

        localStorage.getItem("company") || "";

    skillsInput.value =

        localStorage.getItem("skills") || "";

    counter.textContent =

        `${skillsInput.value.length} / 500`;

}

loadData();

[nameInput,

roleInput,

companyInput,

skillsInput].forEach(input=>{

input.addEventListener("input",saveData);

});

// ======================================================

// Toast

// ======================================================

function showToast(message){

toast.innerText = message;

toast.style.display = "block";

setTimeout(()=>{

toast.style.display = "none";

},2500);

}
// ======================================================
// Resume Reader (PDF.js)
// ======================================================

resumeInput.addEventListener("change", async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    if (file.type !== "application/pdf") {

        showToast("Please upload a PDF file.");

        resumeInput.value = "";

        return;

    }

    try {

        const arrayBuffer = await file.arrayBuffer();

        const pdf = await pdfjsLib.getDocument({

            data: arrayBuffer

        }).promise;

        resumeText = "";

        for (let page = 1; page <= pdf.numPages; page++) {

            const pdfPage = await pdf.getPage(page);

            const textContent = await pdfPage.getTextContent();

            resumeText += textContent.items
                .map(item => item.str)
                .join(" ");

            resumeText += "\n\n";

        }

        showToast("Resume uploaded successfully!");

    }

    catch (error) {

        console.error(error);

        resumeText = "";

        showToast("Unable to read PDF.");

    }

});

// ======================================================
// Generate Cover Letter
// ======================================================

form.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = nameInput.value.trim();
    const role = roleInput.value.trim();
    const company = companyInput.value.trim();
    const skills = skillsInput.value.trim();

    if (!name || !role || !company || !skills) {

        showToast("Please fill all required fields.");

        return;

    }

    loading.style.display = "block";

    output.innerHTML = "";

    copyBtn.disabled = true;
    downloadBtn.disabled = true;

    const payload = {

        name,
        role,
        company,
        skills,
        resume: resumeText

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(payload)

        });

        const result = await response.json();

        if (!response.ok) {

            throw new Error(

                result.message ||

                "Server Error"

            );

        }

        output.innerText =

            result.letter ||

            "No cover letter generated.";

        copyBtn.disabled = false;

        downloadBtn.disabled = false;

        showToast("Cover Letter Generated!");

    }

    catch (error) {

        console.error(error);

        output.innerHTML = `

❌ Unable to generate cover letter.

<br><br>

${error.message}

`;

        showToast("Generation Failed");

    }

    finally {

        loading.style.display = "none";

    }

});
copyBtn.addEventListener("click", async () => {

    const text = output.innerText.trim();

    if (

        !text ||

        text.includes("Your AI-generated cover letter") ||

        text.includes("Unable to generate")

    ) {

        showToast("Generate a cover letter first!");

        return;

    }

    try {

        await navigator.clipboard.writeText(text);

        copyBtn.innerHTML =

            '<i class="fa-solid fa-check"></i> Copied';

        showToast("Copied to Clipboard!");

        setTimeout(() => {

            copyBtn.innerHTML =

                '<i class="fa-solid fa-copy"></i> Copy';

        }, 2000);

    }

    catch (error) {

        console.error(error);

        showToast("Unable to copy.");

    }

});

// ======================================================

// Download PDF

// ======================================================

downloadBtn.addEventListener("click", () => {

    const text = output.innerText.trim();

    if (

        !text ||

        text.includes("Your AI-generated cover letter") ||

        text.includes("Unable to generate")

    ) {

        showToast("Nothing to download!");

        return;

    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const candidateName =

        nameInput.value.trim() || "Candidate";

    doc.setFont("times", "bold");

    doc.setFontSize(18);

    doc.text("AI Generated Cover Letter", 20, 20);

    doc.setFont("times", "normal");

    doc.setFontSize(10);

    doc.text(

        "Generated on: " +

        new Date().toLocaleString(),

        20,

        30

    );

    doc.setFontSize(12);

    const lines = doc.splitTextToSize(

        text,

        170

    );

    doc.text(lines, 20, 45);

    doc.save(

        `${candidateName.replace(/\s+/g, "_")}_Cover_Letter.pdf`

    );

    showToast("PDF Downloaded!");

});

// ======================================================

// Reset Form

// ======================================================

resetBtn.addEventListener("click", () => {

    localStorage.removeItem("name");

    localStorage.removeItem("role");

    localStorage.removeItem("company");

    localStorage.removeItem("skills");

    resumeInput.value = "";

    resumeText = "";

    counter.textContent = "0 / 500";

    output.innerHTML = `

<p class="placeholder">

✨ Your AI-generated cover letter will appear here.

</p>

`;

    copyBtn.disabled = true;

    downloadBtn.disabled = true;

    showToast("Form Reset!");

});

// ======================================================

// Simple Validation

// ======================================================

[nameInput,

roleInput,

companyInput,

skillsInput].forEach(input => {

    input.addEventListener("blur", () => {

        if (input.value.trim() === "") {

            input.style.borderColor = "#EF4444";

        }

        else {

            input.style.borderColor = "";

        }

    });

});

// ======================================================

// Startup

// ======================================================

window.addEventListener("load", () => {

    console.log("✅ AI Cover Letter Generator Loaded");

    output.innerHTML = `

<p class="placeholder">

✨ Your AI-generated cover letter will appear here.

<br><br>

Fill in your details and click <strong>Generate</strong>.

</p>

`;

    copyBtn.disabled = true;

    downloadBtn.disabled = true;

});