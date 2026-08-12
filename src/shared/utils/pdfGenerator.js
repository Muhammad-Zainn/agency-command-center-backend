const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

exports.generatePDF = async (templateName, data) => {
  try {
    // 1. Find the path to our HTML/EJS template
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.ejs`,
    );

    // 2. Inject our dynamic data (project title, budget, etc.) into the template
    const htmlContent = await ejs.renderFile(templatePath, data);

    // 3. Ensure a local folder exists to temporarily save the PDF
    const outputDir = path.join(__dirname, "..", "..", "..", "public", "pdfs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 4. Create a unique filename based on the current time
    const fileName = `${templateName}-${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    // 5. Fire up the invisible Chrome browser (Puppeteer) with Windows-safe flags
    const browser = await puppeteer.launch({
      headless: true, // Changed from "new" to true for better compatibility
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage", // Overcomes limited resource problems
        "--disable-gpu", // Sometimes required on Windows
        "--no-zygote", // Prevents certain background process hangs
      ],
    });

    const page = await browser.newPage();

    // 6. Load our rendered HTML into this invisible browser
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // 7. Take a "Snapshot" and save it as a PDF!
    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true, // Ensures our CSS colors/backgrounds appear
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    // 8. Close the invisible browser
    await browser.close();

    // 9. Return the local path to the generated file
    // In the future, this is where we would upload it to AWS S3!
    return `/pdfs/${fileName}`;
  } catch (error) {
    console.error("❌ PDF Generation Error: ", error);
    throw new Error("Could not generate PDF");
  }
};
