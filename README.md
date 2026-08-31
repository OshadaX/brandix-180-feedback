# 180° Feedback Report Automated Generator (Static Client-Side)

A fully client-side tool that automates ratings calculations, displays interactive charts, and compiles professional multi-page PDF reports for the 180° Feedback process. 

Everything runs directly in your web browser—no servers, Python environments, or command lines required.

## Key Features
* **Zero Dependencies**: Simply open `index.html` in any web browser.
* **Full Data Privacy**: Your data is parsed, calculated, and exported entirely within your browser. No files are uploaded to any external server.
* **Instant Exports**: Generate a beautifully styled, multi-page feedback PDF or export your current entries back to a structured Excel template instantly.

## Files Included

1. **`index.html`**: The single-page dashboard containing the uploader, profile input fields, qualitative feedback panels, and action controls.
2. **`style.css`**: Responsive glassmorphic styles tailored with colors indicating Self (Orange), Supervisor (Purple), and Peers (Green).
3. **`app.js`**: Core program logic utilizing SheetJS for Excel reading/writing, Chart.js for data visualization, and jsPDF for document compiling.
4. **`180_Evaluation_Template.xlsx`**: Standard Excel workbook structure for manual data preparation.

## How to Run Locally

Double-click **`index.html`** on your computer to open it in your web browser, or right-click the file and select your browser of choice.

* **Upload Excel**: Imports profile data, scores, and text comments from an evaluation template file directly into the visual grid.
* **Export Excel Data**: Saves the visual dashboard's current values back into a clean Excel spreadsheet.
* **Generate PDF Report**: Dynamically renders competency charts and compiles the multi-page PDF report matching standard styling instructions.

## Hosting on GitHub Pages
To share this application as a link with other users:
1. Push `index.html`, `style.css`, `app.js`, and `180_Evaluation_Template.xlsx` to a GitHub repository.
2. Navigate to **Settings** > **Pages** in the repository.
3. Choose your main branch as the source and click **Save**.
4. Access the tool online at `https://<your-username>.github.io/<your-repository-name>/`.
