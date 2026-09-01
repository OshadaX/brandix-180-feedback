# 180° Feedback Report Automated Generator (Static Client-Side)

A fully client-side tool that automates ratings calculations, displays interactive charts, and compiles professional multi-page PDF reports for the 180° Feedback process. 

Everything runs directly in your web browser—no servers, Python environments, or command lines required.

## Key Features
* **Zero Dependencies**: Simply open `index.html` in any web browser.
* **AI Copilot & Performance Coach**: Interactive chatbot assistant that answers questions, extracts strengths, calculates blind spots, suggests 30-day action plans, and prepares 1-on-1 meeting agendas.
* **Chat-Driven Workflow**: Upload `.xlsx` spreadsheets directly inside the chat or ask the chatbot to generate and download the PDF report on demand.
* **Full Data Privacy**: Your data is parsed, calculated, and exported entirely within your browser. No files are uploaded to any external server.
* **Instant Exports**: Generate a beautifully styled, multi-page feedback PDF or export your current entries back to a structured Excel template instantly.

## Files Included

1. **`index.html`**: The dashboard containing the AI Copilot widget, insights summary cards, uploader, and action controls.
2. **`style.css`**: Responsive glassmorphic styles tailored with colors indicating Self (Orange), Supervisor (Purple), and Peers (Green), plus full chatbot interface styling.
3. **`app.js`**: Core program logic utilizing SheetJS for Excel reading/writing, Chart.js for data visualization, jsPDF for document compiling, and the AI suggestions engine.
4. **`180_Evaluation_Template.xlsx`**: Standard Excel workbook structure for manual data preparation.

## How to Run Locally

Double-click **`index.html`** on your computer to open it in your web browser, or right-click the file and select your browser of choice.

* **Chat with AI Coach**: Click the floating 💬 button at the bottom right to talk to the AI Coach.
* **Upload Excel**: Drop your file or attach it via the paperclip icon in the chatbot.
* **Ask for Suggestions**: Ask *"What are my top strengths?"*, *"Show my blind spots"*, or *"Give me a 30-day action plan"*.
* **Generate PDF Report**: Type *"generate pdf"* in the chat or click the **Download PDF Report** button.

## Hosting on GitHub Pages
To share this application as a link with other users:
1. Push `index.html`, `style.css`, `app.js`, and `180_Evaluation_Template.xlsx` to a GitHub repository.
2. Navigate to **Settings** > **Pages** in the repository.
3. Choose your main branch as the source and click **Save**.
4. Access the tool online at `https://<your-username>.github.io/<your-repository-name>/`.
