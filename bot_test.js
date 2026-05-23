const puppeteer = require("puppeteer");

(async function testBot() {
  const url = "http://localhost:8080";
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  page.on("console", (msg) =>
    console.log(`[${msg.type().toUpperCase()}] ${msg.text()}`)
  );
  await page.goto(url);
 
  const verdict = await page.$eval("#verdictResult", (el) => el.textContent);
  const signals = await page.$$eval(".detector-row", (rows) =>
    rows.map((r) => ({
      name: r.querySelector(".detector-name").textContent,
      status: r.querySelector(".detector-status").textContent.trim(),
    }))
  );

  console.log("BOT DETECTION RESULTS");
  console.log("Verdict:", verdict);
  console.log("\nSignals:");
  signals.forEach((s) => console.log(`  ${s.name}: ${s.status}`));
  await browser.close();
})();