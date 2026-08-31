// 180 Feedback Generator - Client-Side App Logic
const COMPETENCIES = [
    {
        name: "Deciding & Initiating Action",
        questions: [
            "When faced with unclear instructions or ambiguity, this person takes initiative rather than waiting for direction.",
            "Demonstrates the confidence to make day-to-day decisions independently without escalating unnecessarily.",
            "Has taken initiative to improve a work process or solve a recurring issue."
        ]
    },
    {
        name: "Leading & Supervising",
        questions: [
            "Offers support and guidance when team members struggle or underperform.",
            "Steps up and takes leadership when the team lacks direction or motivation.",
            "Holds self and others accountable to commitments."
        ]
    },
    {
        name: "Working with People",
        questions: [
            "Actively listens and validates others' opinions during discussions.",
            "Stays calm and respectful even when team disagreements occur.",
            "Makes an effort to include others and doesn't let personal biases affect working relationships.",
            "Offers help when peers are overwhelmed, even if not asked."
        ]
    },
    {
        name: "Persuading & Influencing",
        questions: [
            "Presents arguments or proposals in a way that gets others to support them.",
            "Has been able to influence a group or team decision through logic or clarity.",
            "Uses data, stories, or examples to persuade others rather than relying on authority.",
            "Shows awareness of others' concerns and adapts the message accordingly."
        ]
    },
    {
        name: "Presenting & Communicating Information",
        questions: [
            "Delivers ideas confidently and clearly in team discussions or presentations.",
            "Can summarize complex topics in a simple way when presenting.",
            "Adjusts tone and delivery depending on the audience (e.g., peers vs seniors).",
            "Engages the audience, invites feedback or questions when presenting."
        ]
    },
    {
        name: "Writing & Reporting",
        questions: [
            "Communicates clearly in emails or written reports with minimal errors.",
            "Uses structure and formatting effectively to present information logically.",
            "Can tailor written content to suit different audiences (e.g., team vs leadership).",
            "Writes summaries, reports, or proposals that are easy to follow and fact-based."
        ]
    },
    {
        name: "Analyzing",
        questions: [
            "Breaks down problems by identifying root causes rather than surface symptoms.",
            "Uses data and evidence to analyze a situation before making recommendations.",
            "Asks the right questions before jumping to conclusions.",
            "Has identified trends or patterns others missed."
        ]
    },
    {
        name: "Creativity & Innovation",
        questions: [
            "Suggests new ways of doing things, even in traditional areas.",
            "When faced with a challenge, explores multiple options before settling on a solution.",
            "Has introduced or championed a creative idea that improved work.",
            "Is open to experimenting and learning from failure."
        ]
    },
    {
        name: "Planning & Organizing",
        questions: [
            "Breaks down large tasks into manageable steps and allocates time effectively.",
            "Prepares for meetings, deadlines, and deliverables in advance.",
            "Has helped the team stay organized or brought in tools/processes to improve efficiency.",
            "Manages competing priorities without missing deadlines."
        ]
    },
    {
        name: "Problem Solving",
        questions: [
            "Identifies problems early and raises them constructively.",
            "Considers multiple options before settling on a solution.",
            "Brings others into the problem-solving process when needed.",
            "Remains calm and solution-focused under pressure."
        ]
    }
];

const QUAL_QUESTIONS = [
    "What are the two competencies you believe are your greatest strengths, and how have you demonstrated them?",
    "Which competency do you find most challenging, and what are you doing (or planning to do) to improve in this area?",
    "What is one specific area where you would like coaching or development support moving forward?"
];

// Color definitions
const HEX_SELF = "#F97316";
const HEX_SUPERVISOR = "#8B5CF6";
const HEX_PEERS = "#10B981";

const COLOR_SELF_RGB = [249, 115, 22];
const COLOR_SUPERVISOR_RGB = [139, 92, 246];
const COLOR_PEERS_RGB = [16, 185, 129];

// Store custom interpretations
let customInterpretations = {};

// Setup elements and drag & drop listeners on load
document.addEventListener("DOMContentLoaded", () => {
    renderTabNavigation();
    renderQuestionsPanels();
    renderQualitativeFields();
    showTab(0);
    setupDragAndDrop();
});

// Accordion toggle
window.toggleAccordion = function() {
    const acc = document.getElementById("editorAccordion");
    acc.classList.toggle("open");
};

// Drag and drop setup
function setupDragAndDrop() {
    const dropZone = document.getElementById("dropZone");

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
        }, false);
    });

    dropZone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length > 0) {
            document.getElementById("excelFile").files = files;
            handleExcelFile(files[0]);
        }
    }, false);
}

// Render dynamic parts
function renderTabNavigation() {
    const nav = document.getElementById("compNav");
    nav.innerHTML = COMPETENCIES.map((comp, idx) => `
        <button type="button" class="comp-btn ${idx === 0 ? 'active' : ''}" onclick="showTab(${idx})">
            ${idx + 1}. ${comp.name}
        </button>
    `).join("");
}

function renderQuestionsPanels() {
    const container = document.getElementById("questionsContent");
    container.innerHTML = COMPETENCIES.map((comp, compIdx) => `
        <div id="panel-${compIdx}" class="questions-panel ${compIdx === 0 ? 'active' : ''}">
            <div class="questions-panel-header">${comp.name} Assessment</div>
            ${comp.questions.map((q, qIdx) => `
                <div class="q-row">
                    <div class="q-text">Q${qIdx + 1}: ${q}</div>
                    <div class="ratings-grid">
                        <div class="rating-input self">
                            <span>Self</span>
                            <input type="number" name="score_${compIdx}_${qIdx}_0" min="1" max="5" value="4" required>
                        </div>
                        <div class="rating-input supervisor">
                            <span>Boss</span>
                            <input type="number" name="score_${compIdx}_${qIdx}_1" min="1" max="5" value="4" required>
                        </div>
                        <div class="rating-input peer">
                            <span>Peer 1</span>
                            <input type="number" name="score_${compIdx}_${qIdx}_2" min="1" max="5" value="4" required>
                        </div>
                        <div class="rating-input peer">
                            <span>Peer 2</span>
                            <input type="number" name="score_${compIdx}_${qIdx}_3" min="1" max="5" value="4" required>
                        </div>
                        <div class="rating-input peer">
                            <span>Peer 3</span>
                            <input type="number" name="score_${compIdx}_${qIdx}_4" min="1" max="5" value="4" required>
                        </div>
                    </div>
                </div>
            `).join("")}
        </div>
    `).join("");
}

function renderQualitativeFields() {
    const container = document.getElementById("qualContent");
    container.innerHTML = QUAL_QUESTIONS.map((q, qIdx) => `
        <div class="qual-section">
            <div class="qual-title">Q${qIdx + 1}: ${q}</div>
            <div class="qual-textareas">
                <div class="qual-group self">
                    <span>Self Answer</span>
                    <textarea name="qual_${qIdx}_0" placeholder="Type self reflection..."></textarea>
                </div>
                <div class="qual-group supervisor">
                    <span>Boss Answer</span>
                    <textarea name="qual_${qIdx}_1" placeholder="Type supervisor feedback..."></textarea>
                </div>
                <div class="qual-group peer">
                    <span>Peer 1 Comment</span>
                    <textarea name="qual_${qIdx}_2" placeholder="Type peer 1 feedback..."></textarea>
                </div>
                <div class="qual-group peer">
                    <span>Peer 2 Comment</span>
                    <textarea name="qual_${qIdx}_3" placeholder="Type peer 2 feedback..."></textarea>
                </div>
                <div class="qual-group peer">
                    <span>Peer 3 Comment</span>
                    <textarea name="qual_${qIdx}_4" placeholder="Type peer 3 feedback..."></textarea>
                </div>
            </div>
        </div>
    `).join("");
}

window.showTab = function(idx) {
    document.querySelectorAll('.comp-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.questions-panel').forEach(panel => panel.classList.remove('active'));
    
    document.querySelectorAll('.comp-btn')[idx].classList.add('active');
    document.getElementById('panel-' + idx).classList.add('active');
};

// Handle file input selection
window.handleExcelUpload = function(event) {
    const file = event.target.files[0];
    if (file) handleExcelFile(file);
};

// core file handler
function handleExcelFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        customInterpretations = {};
        if (workbook.SheetNames.includes("Take Away")) {
            const wsTake = workbook.Sheets["Take Away"];
            const rawTake = XLSX.utils.sheet_to_json(wsTake, { header: 1 });
            for (let r = 1; r < rawTake.length; r++) {
                const compName = rawTake[r][0];
                const interpretation = rawTake[r][4];
                if (compName && interpretation) {
                    customInterpretations[compName.toString().trim()] = interpretation.toString().trim();
                }
            }
        }

        let parsedInfo = {
            studentName: "Student",
            designation: "",
            department: "",
            period: ""
        };

        if (workbook.SheetNames.includes("Student Info")) {
            // Standard Format
            const wsInfo = workbook.Sheets["Student Info"];
            const infoData = XLSX.utils.sheet_to_json(wsInfo, { header: 1 });
            
            infoData.forEach(row => {
                const label = row[0] ? row[0].toString().trim() : "";
                const val = row[1] ? row[1].toString().trim() : "";
                if (label === "Student Name") parsedInfo.studentName = val;
                if (label === "Designation") parsedInfo.designation = val;
                if (label === "Department/Unit") parsedInfo.department = val;
                if (label === "Evaluation Date/Period") parsedInfo.period = val;
                if (label === "Supervisor Name") {
                    const supervisorInput = document.getElementById("supervisor_name");
                    if (supervisorInput) supervisorInput.value = val;
                }
            });

            // Build sequential mapping of questions
            const sequentialQuestions = [];
            COMPETENCIES.forEach((comp, compIdx) => {
                comp.questions.forEach((q, qIdx) => {
                    sequentialQuestions.push({ compIdx, qIdx });
                });
            });

            // Parse scores
            const wsScores = workbook.Sheets["Quantitative Scores"];
            const scoresData = XLSX.utils.sheet_to_json(wsScores, { header: 1 });
            for (let r = 1; r < scoresData.length; r++) {
                const qInfo = sequentialQuestions[r - 1];
                if (qInfo) {
                    const { compIdx, qIdx } = qInfo;
                    for (let col = 0; col < 5; col++) {
                        const val = parseFloat(scoresData[r][2 + col]) || 4;
                        const input = document.querySelector(`input[name="score_${compIdx}_${qIdx}_${col}"]`);
                        if (input) input.value = val;
                    }
                }
            }

            // Parse qualitative feedback
            const wsQual = workbook.Sheets["Qualitative Feedback"];
            const qualData = XLSX.utils.sheet_to_json(wsQual, { header: 1 });
            for (let r = 1; r <= 3; r++) {
                const qIdx = r - 1;
                if (qualData[r]) {
                    for (let col = 0; col < 5; col++) {
                        const val = qualData[r][1 + col] ? qualData[r][1 + col].toString().trim() : "";
                        const textarea = document.querySelector(`textarea[name="qual_${qIdx}_${col}"]`);
                        if (textarea) textarea.value = val;
                    }
                }
            }
        } else {
            // Alternate Format (Lecturer Sheet name is the student name)
            const sheetName = workbook.SheetNames[0];
            parsedInfo.studentName = sheetName.trim();
            parsedInfo.period = "August 2026";

            const wsMain = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(wsMain, { header: 1 });

            // Build sequential mapping of questions
            const sequentialQuestions = [];
            COMPETENCIES.forEach((comp, compIdx) => {
                comp.questions.forEach((q, qIdx) => {
                    sequentialQuestions.push({ compIdx, qIdx });
                });
            });

            for (let r = 1; r < 39; r++) {
                const qInfo = sequentialQuestions[r - 1];
                if (qInfo) {
                    const { compIdx, qIdx } = qInfo;
                    const row = rawData[r];
                    if (row) {
                        for (let col = 0; col < 5; col++) {
                            const val = parseFloat(row[3 + col]) || 4;
                            const input = document.querySelector(`input[name="score_${compIdx}_${qIdx}_${col}"]`);
                            if (input) input.value = val;
                        }
                    }
                }
            }

            for (let r = 39; r < 42; r++) {
                const qIdx = r - 39;
                const row = rawData[r];
                if (row) {
                    for (let col = 0; col < 5; col++) {
                        const val = row[3 + col] ? row[3 + col].toString().trim() : "";
                        const textarea = document.querySelector(`textarea[name="qual_${qIdx}_${col}"]`);
                        if (textarea) textarea.value = val;
                    }
                }
            }
        }

        // Update profile form fields
        document.getElementById("student_name").value = parsedInfo.studentName;
        document.getElementById("designation").value = parsedInfo.designation;
        document.getElementById("department").value = parsedInfo.department;
        document.getElementById("period").value = parsedInfo.period;

        // Populate Status preview card labels
        document.getElementById("lblStudentName").innerText = parsedInfo.studentName;
        document.getElementById("lblDesignation").innerText = parsedInfo.designation || "N/A";
        document.getElementById("lblDepartment").innerText = parsedInfo.department || "N/A";
        document.getElementById("lblPeriod").innerText = parsedInfo.period || "N/A";

        // Display Status card and editor accordion
        document.getElementById("statusCard").style.display = "block";
        document.getElementById("editorAccordion").style.display = "block";

        // Scroll to the status card smoothly
        document.getElementById("statusCard").scrollIntoView({ behavior: 'smooth' });
    };
    reader.readAsArrayBuffer(file);
}

// Download Excel Template
window.downloadExcelTemplate = function() {
    const studentName = document.getElementById("student_name").value || "Student";
    const designation = document.getElementById("designation").value || "";
    const department = document.getElementById("department").value || "";
    const period = document.getElementById("period").value || "";
    const supervisorName = document.getElementById("supervisor_name").value || "";

    const wb = XLSX.utils.book_new();

    const wsInfoData = [
        ["180 Evaluation - Student Profile Information", ""],
        ["", ""],
        ["Student Name", studentName],
        ["Designation", designation],
        ["Department/Unit", department],
        ["Evaluation Date/Period", period],
        ["Supervisor Name", supervisorName]
    ];
    const wsInfo = XLSX.utils.aoa_to_sheet(wsInfoData);
    XLSX.utils.book_append_sheet(wb, wsInfo, "Student Info");

    const wsScoresData = [
        ["Competency Name", "Question Text", "Self (1-5)", "Supervisor (1-5)", "Peer 1 (1-5)", "Peer 2 (1-5)", "Peer 3 (1-5)"]
    ];

    COMPETENCIES.forEach((comp, compIdx) => {
        comp.questions.forEach((q, qIdx) => {
            const selfVal = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_0"]`).value) || 4;
            const superVal = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_1"]`).value) || 4;
            const p1 = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_2"]`).value) || 4;
            const p2 = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_3"]`).value) || 4;
            const p3 = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_4"]`).value) || 4;
            wsScoresData.push([comp.name, q, selfVal, superVal, p1, p2, p3]);
        });
    });
    const wsScores = XLSX.utils.aoa_to_sheet(wsScoresData);
    XLSX.utils.book_append_sheet(wb, wsScores, "Quantitative Scores");

    const wsQualData = [
        ["Feedback Question", "Self Answer", "Supervisor Answer", "Peer 1", "Peer 2", "Peer 3"]
    ];
    QUAL_QUESTIONS.forEach((q, qIdx) => {
        const selfAns = document.querySelector(`textarea[name="qual_${qIdx}_0"]`).value || "";
        const superAns = document.querySelector(`textarea[name="qual_${qIdx}_1"]`).value || "";
        const p1 = document.querySelector(`textarea[name="qual_${qIdx}_2"]`).value || "";
        const p2 = document.querySelector(`textarea[name="qual_${qIdx}_3"]`).value || "";
        const p3 = document.querySelector(`textarea[name="qual_${qIdx}_4"]`).value || "";
        wsQualData.push([q, selfAns, superAns, p1, p2, p3]);
    });
    const wsQual = XLSX.utils.aoa_to_sheet(wsQualData);
    XLSX.utils.book_append_sheet(wb, wsQual, "Qualitative Feedback");

    const fileName = `Evaluation_${studentName.replace(/\s+/g, "_")}.xlsx`;
    XLSX.writeFile(wb, fileName);
};

// Loader helpers
function setLoaderStep(text, pct) {
    document.getElementById("loaderStep").innerText = text;
    document.getElementById("progressBar").style.width = pct + "%";
}

function showLoader() {
    document.getElementById("loaderOverlay").style.display = "flex";
}

function hideLoader() {
    document.getElementById("loaderOverlay").style.display = "none";
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate and Compile PDF Report
window.generatePdfReport = async function() {
    const form = document.getElementById("evalForm");
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    showLoader();
    setLoaderStep("Reading evaluation data...", 5);
    await delay(300);

    const studentName = document.getElementById("student_name").value || "Student";
    const designation = document.getElementById("designation").value || "";
    const department = document.getElementById("department").value || "";
    const period = document.getElementById("period").value || "";

    const dfQuestions = [];
    const compAverages = [];

    setLoaderStep("Calculating competency averages...", 18);
    await delay(200);

    COMPETENCIES.forEach((comp, compIdx) => {
        let selfSum = 0;
        let superSum = 0;
        let peerSum = 0;
        let qCount = comp.questions.length;
        const compQs = [];

        comp.questions.forEach((q, qIdx) => {
            const selfVal = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_0"]`).value) || 4;
            const superVal = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_1"]`).value) || 4;
            const p1 = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_2"]`).value) || 4;
            const p2 = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_3"]`).value) || 4;
            const p3 = parseFloat(document.querySelector(`input[name="score_${compIdx}_${qIdx}_4"]`).value) || 4;
            const peerAvg = parseFloat(((p1 + p2 + p3) / 3).toFixed(2));

            selfSum += selfVal;
            superSum += superVal;
            peerSum += peerAvg;

            const qObj = {
                question: q,
                self: selfVal,
                supervisor: superVal,
                peer_avg: peerAvg
            };
            compQs.push(qObj);
            dfQuestions.push(qObj);
        });

        compAverages.push({
            name: comp.name,
            self: parseFloat((selfSum / qCount).toFixed(2)),
            supervisor: parseFloat((superSum / qCount).toFixed(2)),
            peer_avg: parseFloat((peerSum / qCount).toFixed(2)),
            questions: compQs
        });
    });

    const qualitative = QUAL_QUESTIONS.map((q, qIdx) => {
        const selfAns = document.querySelector(`textarea[name="qual_${qIdx}_0"]`).value || "";
        const superAns = document.querySelector(`textarea[name="qual_${qIdx}_1"]`).value || "";
        const p1 = document.querySelector(`textarea[name="qual_${qIdx}_2"]`).value || "";
        const p2 = document.querySelector(`textarea[name="qual_${qIdx}_3"]`).value || "";
        const p3 = document.querySelector(`textarea[name="qual_${qIdx}_4"]`).value || "";
        return {
            question: q,
            self: selfAns,
            supervisor: superAns,
            peers: [p1, p2, p3].map(c => c.trim()).filter(c => c !== "")
        };
    });

    setLoaderStep("Rendering radar chart...", 35);
    await delay(150);
    const radarDataUrl = await renderRadarChart(compAverages);

    setLoaderStep("Rendering competency bar charts...", 52);
    await delay(150);
    const compChartImages = {};
    for (const comp of compAverages) {
        compChartImages[comp.name] = await renderBarChart(comp);
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    function addHeaderFooter(doc, studentName, reportDate) {
        if (doc.internal.getNumberOfPages() > 1) {
            doc.setFont("Helvetica", "oblique");
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(`${studentName} | 180 Feedback Report`, 15, 10);
            doc.text("Personal & Confidential", pageW - 15, 10, { align: "right" });
            
            doc.setPage(doc.internal.getNumberOfPages());
            doc.text(`${doc.internal.getNumberOfPages()}`, pageW / 2, pageH - 10, { align: "center" });
        }
    }

    // COVER PAGE
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageW, pageH, "F");

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(36);
    doc.setTextColor(255, 255, 255);
    doc.text("180 FEEDBACK", pageW / 2, 90, { align: "center" });
    doc.text("REPORT", pageW / 2, 105, { align: "center" });

    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(40, 125, pageW - 40, 125);

    doc.setFontSize(20);
    doc.text(studentName.toUpperCase(), pageW / 2, 145, { align: "center" });

    if (designation) {
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(200, 200, 200);
        doc.text(designation, pageW / 2, 155, { align: "center" });
    }

    doc.setFont("Helvetica", "oblique");
    doc.setFontSize(10);
    doc.setTextColor(180, 180, 180);
    doc.text(`This Report is Personal & Confidential - ${period}`, pageW / 2, pageH - 30, { align: "center" });

    // PAGE 2: INTRODUCTION
    doc.addPage();
    doc.setTextColor(30, 41, 59);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("What is a 180 Degree Feedback Evaluation?", 15, 25);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    let introTxt = "The 180 Feedback Evaluation is designed to give you meaningful insights into how you are " +
        "perceived by the people you work most closely with, your peers and your supervisor. Unlike " +
        "a traditional review, which is often one-sided, this process allows you to see yourself " +
        "through multiple perspectives. The goal is to:\n" +
        "  - Help you recognise your strengths that contribute to the team's success.\n" +
        "  - Identify areas where you can grow and develop further.\n" +
        "  - Encourage you to embrace feedback as a tool for improvement.\n\n" +
        "Feedback bridges the gap between how you think you work and how others experience your " +
        "work. Understanding this difference can help you:\n" +
        "  - Strengthen your relationships at work\n" +
        "  - Adjust your communication and collaboration style for better results\n" +
        "  - Align your efforts more closely with team and organizational goals\n\n" +
        "Remember - This process isn't about pointing out faults. It's about giving you clarity, " +
        "perspective, and the opportunity to take ownership of your growth in a supportive environment.";
    doc.text(doc.splitTextToSize(introTxt, pageW - 30), 15, 35);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Understanding Your Report", 15, 140);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    let underTxt = "Your multi-rater feedback report is broken into four sections. Each section is " +
        "designed to present your results from a different perspective, in a way that " +
        "assists your personal development:\n\n" +
        "Section 01 - Overall Competency Summary shows your scores at a glance under each of " +
        "the main competency headings, showing how your self-scores match up against the " +
        "scores that your respondents gave.\n\n" +
        "Section 02 - The individual competency detail section takes each competency in turn and " +
        "analyses it in terms of your scores against each of the individual behavioural questions.\n\n" +
        "Section 03 - The free text comments (Qualitative Feel) are that you and your respondents " +
        "gave in response to the qualitative questions in the questionnaire.\n\n" +
        "Section 04 - This segment highlights your strengths and development areas in terms of the " +
        "importance and performance of the stated attributes.";
    doc.text(doc.splitTextToSize(underTxt, pageW - 30), 15, 150);
    addHeaderFooter(doc, studentName, period);

    // PAGE 3: SCORING SYSTEM
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text("Scoring System", 15, 25);
    
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.text("You and your respondents were asked to provide feedback on several multiple-", 15, 35);
    doc.text("choice questions using a five-point scale to evaluate performance. The chart", 15, 41);
    doc.text("below shows the scale as per the questionnaires.", 15, 47);

    doc.setFont("Helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(15, 58, 30, 8, "FD");
    doc.rect(45, 58, 70, 8, "FD");
    doc.text("Scale Score", 20, 63);
    doc.text("Performance Rating", 50, 63);

    const scale = [
        ["1", "Strongly Disagree"],
        ["2", "Disagree"],
        ["3", "Neutral"],
        ["4", "Agree"],
        ["5", "Strongly Agree"]
    ];
    doc.setFont("Helvetica", "normal");
    scale.forEach((item, idx) => {
        const y = 66 + (idx * 8);
        doc.rect(15, y, 30, 8);
        doc.rect(45, y, 70, 8);
        doc.text(item[0], 20, y + 5);
        doc.text(item[1], 50, y + 5);
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Respondent Group Count", 15, 125);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("  - Self: 01", 15, 133);
    doc.text("  - Supervisor: 01", 15, 139);
    doc.text("  - Peers: 03", 15, 145);

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Relationship Key / Color Codes", 15, 165);

    doc.setFillColor(...COLOR_SELF_RGB);
    doc.rect(15, 175, 8, 8, "F");
    doc.setTextColor(30, 41, 59);
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Self", 27, 181);

    doc.setFillColor(...COLOR_SUPERVISOR_RGB);
    doc.rect(45, 175, 8, 8, "F");
    doc.text("Supervisor", 57, 181);

    doc.setFillColor(...COLOR_PEERS_RGB);
    doc.rect(85, 175, 8, 8, "F");
    doc.text("Peers", 97, 181);
    
    addHeaderFooter(doc, studentName, period);

    // PAGE 4: RADAR
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SECTION 01 | Overall Competency Summary", 15, 25);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.text("The radar graph below allows you to see how you rated yourself", 15, 33);
    doc.text("in these areas compared with how others rated you.", 15, 39);

    if (radarDataUrl) {
        doc.addImage(radarDataUrl, "PNG", 25, 48, 160, 160);
    }
    addHeaderFooter(doc, studentName, period);

    // PAGES 5-14: INDIVIDUAL ANALYSIS
    compAverages.forEach((comp, compIdx) => {
        doc.addPage();
        doc.setTextColor(30, 41, 59);
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.text("SECTION 02 | Individual Competency Analysis", 15, 25);
        doc.setFontSize(14);
        doc.text(`${compIdx + 1}. ${comp.name.toUpperCase()}`, 15, 33);

        doc.setFont("Helvetica", "normal");
        doc.setFontSize(9);
        let currY = 40;
        comp.questions.forEach((row, qIdx) => {
            const wrappedQ = doc.splitTextToSize(`Q${qIdx + 1}: ${row.question}`, pageW - 30);
            doc.text(wrappedQ, 15, currY);
            currY += (wrappedQ.length * 4) + 1;
        });

        const imgData = compChartImages[comp.name];
        if (imgData) {
            doc.addImage(imgData, "PNG", 20, currY + 4, 170, 85);
        }

        let tableY = currY + 95;
        doc.setFont("Helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(15, tableY, 100, 6, "FD");
        doc.rect(115, tableY, 20, 6, "FD");
        doc.rect(135, tableY, 25, 6, "FD");
        doc.rect(160, tableY, 20, 6, "FD");
        doc.text("Behavioural Question", 17, tableY + 4.5);
        doc.text("Self", 121, tableY + 4.5);
        doc.text("Supervisor", 137, tableY + 4.5);
        doc.text("Peers", 166, tableY + 4.5);

        doc.setFont("Helvetica", "normal");
        comp.questions.forEach((row, qIdx) => {
            const rowY = tableY + 6 + (qIdx * 6);
            doc.rect(15, rowY, 100, 6);
            doc.rect(115, rowY, 20, 6);
            doc.rect(135, rowY, 25, 6);
            doc.rect(160, rowY, 20, 6);
            doc.text(`Q${qIdx + 1}`, 17, rowY + 4.5);
            doc.text(row.self.toFixed(2), 121, rowY + 4.5);
            doc.text(row.supervisor.toFixed(2), 137, rowY + 4.5);
            doc.text(row.peer_avg.toFixed(2), 166, rowY + 4.5);
        });

        addHeaderFooter(doc, studentName, period);
    });

    // PAGES 15-17: QUALITATIVE
    qualitative.forEach((qItem, qIdx) => {
        doc.addPage();
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text("SECTION 03 | QUALITATIVE FEEDBACK", 15, 25);
        
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        const wrappedQ = doc.splitTextToSize(`Question ${qIdx + 1}: ${qItem.question}`, pageW - 30);
        doc.text(wrappedQ, 15, 33);

        let currY = 33 + (wrappedQ.length * 5) + 3;

        doc.setFont("Helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...COLOR_SELF_RGB);
        doc.text("SELF", 15, currY);
        currY += 5;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        const wrappedSelf = doc.splitTextToSize(qItem.self || "No response provided.", pageW - 30);
        doc.text(wrappedSelf, 15, currY);
        currY += (wrappedSelf.length * 4.5) + 6;

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(...COLOR_SUPERVISOR_RGB);
        doc.text("SUPERVISOR", 15, currY);
        currY += 5;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        const wrappedSuper = doc.splitTextToSize(qItem.supervisor || "No response provided.", pageW - 30);
        doc.text(wrappedSuper, 15, currY);
        currY += (wrappedSuper.length * 4.5) + 6;

        doc.setFont("Helvetica", "bold");
        doc.setTextColor(...COLOR_PEERS_RGB);
        doc.text("PEERS", 15, currY);
        currY += 5;
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(50, 50, 50);
        if (qItem.peers.length > 0) {
            qItem.peers.forEach(peerComment => {
                const wrappedComment = doc.splitTextToSize(`- ${peerComment}`, pageW - 35);
                doc.text(wrappedComment, 18, currY);
                currY += (wrappedComment.length * 4.5) + 2;
            });
        } else {
            doc.text("No responses provided.", 15, currY);
        }

        addHeaderFooter(doc, studentName, period);
    });

    // PAGE 18: SUMMARY TABLE
    doc.addPage();
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("SECTION 04 | Take Out & Interpretation Summary", 15, 25);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(50, 50, 50);
    const takeOutIntro = "When you receive high scores in a specific area, that area can be considered a strength. Also, " +
        "when others give you scores higher than you give yourself, that area can be a hidden strength. " +
        "It is called hidden because you may not be aware that others believe you are strong in that area.\n\n" +
        "Conversely, low scores represent opportunities for you to develop your skills in a specific area. " +
        "In addition, when others give you scores lower than you give yourself, you may have a blind spot " +
        "or an area you can focus on for specific improvement.";
    const wrappedIntro = doc.splitTextToSize(takeOutIntro, pageW - 30);
    doc.text(wrappedIntro, 15, 33);

    let currY = 33 + (wrappedIntro.length * 4.5) + 6;

    const strengths = [];
    const developments = [];

    compAverages.forEach(comp => {
        const othersAvg = (comp.supervisor + comp.peer_avg) / 2;
        if (othersAvg >= 4.0) {
            strengths.push(`${comp.name} (Score: ${othersAvg.toFixed(2)})`);
        } else if (othersAvg < 3.8) {
            developments.push(`${comp.name} (Score: ${othersAvg.toFixed(2)})`);
        }
    });

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.text("Key Strengths Identified", 15, currY);
    currY += 5;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    if (strengths.length > 0) {
        strengths.slice(0, 5).forEach(st => {
            doc.text(`  - ${st} - Highly valued and acknowledged by supervisor & peers.`, 15, currY);
            currY += 5;
        });
    } else {
        doc.text("  - Refer to qualitative comments for strength areas.", 15, currY);
        currY += 5;
    }
    currY += 3;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Development Areas Identified", 15, currY);
    currY += 5;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    if (developments.length > 0) {
        developments.slice(0, 5).forEach(dev => {
            doc.text(`  - ${dev} - Potential growth area based on evaluation ratings.`, 15, currY);
            currY += 5;
        });
    } else {
        doc.text("  - Refer to qualitative comments for areas to prioritize.", 15, currY);
        currY += 5;
    }
    currY += 6;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Final Competency Summary Table", 15, currY);
    currY += 4;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setFillColor(240, 240, 240);
    doc.rect(15, currY, 60, 7, "FD");
    doc.rect(75, currY, 15, 7, "FD");
    doc.rect(90, currY, 20, 7, "FD");
    doc.rect(110, currY, 15, 7, "FD");
    doc.rect(125, currY, 70, 7, "FD");
    doc.text("Competency", 17, currY + 5);
    doc.text("Self", 78, currY + 5);
    doc.text("Supervisor", 92, currY + 5);
    doc.text("Peer", 112, currY + 5);
    doc.text("Interpretation Summary", 127, currY + 5);

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    compAverages.forEach(comp => {
        let interpretation = "";
        
        if (customInterpretations[comp.name]) {
            interpretation = customInterpretations[comp.name];
        } else {
            const othersAvg = (comp.supervisor + comp.peer_avg) / 2;
            const diff = comp.self - othersAvg;
            if (diff > 0.4) {
                interpretation = "Possible blind spot (rated self higher)";
            } else if (diff < -0.4) {
                interpretation = "Hidden strength (others rated higher)";
            } else if (othersAvg >= 4.2) {
                interpretation = "Established core strength";
            } else if (othersAvg <= 3.5) {
                interpretation = "Prioritized growth area";
            } else {
                interpretation = "Consistent balanced perception";
            }
        }

        // Wrap competency name and interpretation to get correct line counts
        const wrappedComp = doc.splitTextToSize(comp.name, 56);
        const wrappedInterp = doc.splitTextToSize(interpretation, 66);
        const lineHeight = 4.5;
        const padding = 4;
        // Row height based on whichever column needs most lines
        const rowH = Math.max(wrappedComp.length, wrappedInterp.length) * lineHeight + padding;

        // Check for page overflow
        if (currY + rowH > pageH - 20) {
            doc.addPage();
            addHeaderFooter(doc, studentName, period);
            currY = 20;
            // Redraw table header on new page
            doc.setFont("Helvetica", "bold");
            doc.setFillColor(240, 240, 240);
            doc.rect(15, currY, 60, 7, "FD");
            doc.rect(75, currY, 15, 7, "FD");
            doc.rect(90, currY, 20, 7, "FD");
            doc.rect(110, currY, 15, 7, "FD");
            doc.rect(125, currY, 70, 7, "FD");
            doc.text("Competency", 17, currY + 5);
            doc.text("Self", 78, currY + 5);
            doc.text("Supervisor", 92, currY + 5);
            doc.text("Peer", 112, currY + 5);
            doc.text("Interpretation Summary", 127, currY + 5);
            doc.setFont("Helvetica", "normal");
            currY += 7;
        } else {
            currY += 0;
        }

        // Draw cell borders with dynamic height
        doc.setDrawColor(180, 180, 180);
        doc.rect(15, currY, 60, rowH);
        doc.rect(75, currY, 15, rowH);
        doc.rect(90, currY, 20, rowH);
        doc.rect(110, currY, 15, rowH);
        doc.rect(125, currY, 70, rowH);

        // Fill cell text vertically centered
        const textTop = currY + padding;
        doc.text(wrappedComp, 17, textTop);
        doc.text(comp.self.toFixed(2), 82, currY + rowH / 2 + 1.5, { align: "center" });
        doc.text(comp.supervisor.toFixed(2), 100, currY + rowH / 2 + 1.5, { align: "center" });
        doc.text(comp.peer_avg.toFixed(2), 117, currY + rowH / 2 + 1.5, { align: "center" });
        doc.text(wrappedInterp, 127, textTop);

        currY += rowH;
    });

    addHeaderFooter(doc, studentName, period);

    setLoaderStep("Finalizing and packaging PDF...", 90);
    await delay(400);

    const pdfFileName = `${studentName.replace(/\s+/g, "_")}_180_Feedback_Report.pdf`;

    setLoaderStep("Report ready. Downloading...", 100);
    await delay(350);

    doc.save(pdfFileName);
    hideLoader();
};

// Render Chart.js Radar Chart
function renderRadarChart(compAverages) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");

        const labels = compAverages.map(c => c.name);
        const selfData = compAverages.map(c => c.self);
        const supervisorData = compAverages.map(c => c.supervisor);
        const peerData = compAverages.map(c => c.peer_avg);

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Self',
                        data: selfData,
                        borderColor: HEX_SELF,
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: HEX_SELF
                    },
                    {
                        label: 'Supervisor',
                        data: supervisorData,
                        borderColor: HEX_SUPERVISOR,
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: HEX_SUPERVISOR
                    },
                    {
                        label: 'Peers',
                        data: peerData,
                        borderColor: HEX_PEERS,
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: HEX_PEERS
                    }
                ]
            },
            options: {
                responsive: false,
                animation: false,
                scales: {
                    r: {
                        angleLines: { color: '#cbd5e1' },
                        grid: { color: '#e2e8f0' },
                        suggestedMin: 0,
                        suggestedMax: 5,
                        ticks: {
                            stepSize: 1,
                            backdropColor: 'transparent',
                            color: '#64748b',
                            font: { size: 10 }
                        },
                        pointLabels: {
                            color: '#475569',
                            font: { size: 10, weight: 'bold' }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#0f172a',
                            font: { size: 12, weight: 'bold' }
                        }
                    }
                }
            }
        });

        resolve(canvas.toDataURL('image/png'));
    });
}

// Render Chart.js Bar Chart
function renderBarChart(comp) {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = 700;
        canvas.height = 350;
        const ctx = canvas.getContext("2d");

        const labels = comp.questions.map((_, idx) => `Q${idx + 1}`);
        const selfData = comp.questions.map(q => q.self);
        const supervisorData = comp.questions.map(q => q.supervisor);
        const peerData = comp.questions.map(q => q.peer_avg);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Self',
                        data: selfData,
                        backgroundColor: HEX_SELF
                    },
                    {
                        label: 'Supervisor',
                        data: supervisorData,
                        backgroundColor: HEX_SUPERVISOR
                    },
                    {
                        label: 'Peers',
                        data: peerData,
                        backgroundColor: HEX_PEERS
                    }
                ]
            },
            options: {
                responsive: false,
                animation: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 5.5,
                        grid: { color: '#f1f5f9' },
                        ticks: { color: '#64748b' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { weight: 'bold' } }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: `${comp.name.toUpperCase()} - ITEM ANALYSIS`,
                        color: '#0f172a',
                        font: { size: 12, weight: 'bold' },
                        padding: 10
                    },
                    legend: {
                        position: 'top',
                        labels: { color: '#475569' }
                    }
                }
            }
        });

        resolve(canvas.toDataURL('image/png'));
    });
}
