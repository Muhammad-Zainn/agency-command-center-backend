const puppeteer = require("puppeteer");
const ejs = require("ejs");
const path = require("path");
const fs = require("fs");

exports.generatePDF = async (templateName, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      `${templateName}.ejs`,
    );

    const htmlContent = await ejs.renderFile(templatePath, data);

    const outputDir = path.join(__dirname, "..", "..", "..", "public", "pdfs");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  ]
    const fileName = `${templateName}-${Date.now()}.pdf`;
    const outputPath = path.join(outputDir, fileName);

    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
      ],
    });

    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    return `/pdfs/${fileName}`;
  } catch (error) {
    console.error("PDF Generation Error: ", error);
    throw new Error("Could not generate PDF");
  }
};
