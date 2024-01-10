import puppeteer, { PaperFormat } from "puppeteer";

export async function generatePDF(
  content: string,
  format: PaperFormat = "letter",
  landscape: boolean = true
): Promise<Buffer> {
  const browser = await puppeteer.launch({ headless: "new", args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(content);
  const pdf = await page.pdf({ format, landscape, preferCSSPageSize: true });
  await browser.close();
  return Promise.resolve(pdf);
}
