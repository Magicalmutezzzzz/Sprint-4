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
let resumeText = "";
skillsInput.addEventListener("input", () => {
    counter.textContent = `${skillsInput.value.length} / 500`;
    saveData();
});
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}
darkBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

});
function saveData() {
    localStorage.setItem("name", nameInput.value);
    localStorage.setItem("role", roleInput.value);
    localStorage.setItem("company", companyInput.value);
    localStorage.setItem("skills", skillsInput.value);
}
function loadData() {
    nameInput.value = localStorage.getItem("name") || "";
    roleInput.value = localStorage.getItem("role") || "";
    companyInput.value = localStorage.getItem("company") || "";
    skillsInput.value = localStorage.getItem("skills") || "";
    counter.textContent = `${skillsInput.value.length} / 500`;
}
loadData();
nameInput.addEventListener("input", saveData);
roleInput.addEventListener("input", saveData);
companyInput.addEventListener("input", saveData);
skillsInput.addEventListener("input", saveData);
function showToast(message) {
    toast.innerText = message;
    toast.style.display = "block";
    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}
resumeInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
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
    } catch (err) {
        console.error(err);
        showToast("Unable to read PDF.");
    }
});
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    loading.style.display = "block";
    output.innerHTML = "";
    const data = {
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        company: companyInput.value.trim(),
        skills: skillsInput.value.trim(),
        resume: resumeText

    };
    try {
        const response = await fetch("https://ai-generated-cover-letter.onrender.com/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
});
        if (!response.ok) {
            throw new Error("Server Error");
        }
        const result = await response.json()
        output.innerText = result.text;
        showToast("Cover Letter Generated!");
    }
    catch (error) {
        console.error(error);
        output.innerHTML =
        "❌ Unable to generate cover letter.<br>Please check your server or internet connection.";
        showToast("Generation Failed");
    }
    finally {
        loading.style.display = "none";
    }
});
copyBtn.addEventListener("click", async () => {
    if (output.innerText.trim() === "" ||
        output.innerText === "Your cover letter will appear here...") {
        showToast("Generate a cover letter first!");
        return;
    }
    try {
        await navigator.clipboard.writeText(output.innerText);
        showToast("Copied to Clipboard!");
    } catch (err) {
        console.error(err);
        showToast("Copy Failed!");
    }
});
downloadBtn.addEventListener("click", () => {
    if (output.innerText.trim() === "" ||
        output.innerText === "Your cover letter will appear here...") {
        showToast("Nothing to download!");
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFont("times");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(output.innerText, 180);
    doc.text(lines, 15, 20);
    doc.save("Cover_Letter.pdf");
    showToast("PDF Downloaded!");
});
resetBtn.addEventListener("click", () => {
    localStorage.removeItem("name");
    localStorage.removeItem("role");
    localStorage.removeItem("company");
    localStorage.removeItem("skills");
    resumeInput.value = "";
    resumeText = "";
    output.innerHTML = "Your cover letter will appear here...";
    counter.innerText = "0 / 500";
    showToast("Form Reset!");
});
[nameInput, roleInput, companyInput, skillsInput].forEach(input => {
    input.addEventListener("blur", () => {
        if (input.value.trim() === "") {
          input.style.border = "2px solid red";
        }
        else {
            input.style.border = "1px solid #ccc";
        }
    });
});
window.addEventListener("load", () => {
    console.log("AI Cover Letter Generator Loaded Successfully");
});
