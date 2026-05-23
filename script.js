let pageLoadTime = Date.now();
let mouseMoved = false;
document.addEventListener("mousemove", () => {
  mouseMoved = true;
});

function detectInconsistentEval() {
  const length = eval.toString().length;
  const ua = navigator.userAgent.toLowerCase();
  let browser;
  if (ua.includes("edg/"))                                 browser = "edge";
  else if (ua.includes("trident") || ua.includes("msie")) browser = "internet_explorer";
  else if (ua.includes("firefox"))                         browser = "firefox";
  else if (ua.includes("opera") || ua.includes("opr"))    browser = "opera";
  else if (ua.includes("chrome"))                          browser = "chrome";
  else if (ua.includes("safari"))                          browser = "safari";
  else                                                      browser = "unknown";
  if (browser === "unknown") return false;
  return (
    (length === 33 && !["chrome", "opera", "edge"].includes(browser)) ||
    (length === 37 && !["firefox", "safari"].includes(browser))       ||
    (length === 39 && !["internet_explorer"].includes(browser))
  );
}

function detectBot() {
  const detectors = {
    webDriver:        !!navigator.webdriver,
    headlessBrowser:  navigator.userAgent.includes("Headless"),
    noLanguages:      (navigator.languages?.length || 0) === 0,
    inconsistentEval: detectInconsistentEval(),
    domManipulation:  document.documentElement.getAttributeNames()
                        .some(a => ["selenium", "webdriver", "driver"].includes(a)),
    playwright:       !!window.__playwright__,
    selenium:         !!(window.selenium || window._selenium),
    puppeteer:        !!(window.__nightmare || window.callPhantom),
    fastInteraction:  Date.now() - pageLoadTime < 1000,
    noMouseMovement:  !mouseMoved,
  };

  const triggered = Object.values(detectors).filter(Boolean).length;
  const isBot = triggered > 0;
  return { detectors, triggered, isBot };
}

const { detectors, triggered, isBot } = detectBot();

const verdictBox    = document.getElementById("verdictBox");
const verdictResult = document.getElementById("verdictResult");
const scoreLine     = document.getElementById("scoreLine");
const container     = document.getElementById("detections");
verdictBox.classList.add(isBot ? "bot" : "safe");
verdictResult.textContent = isBot ? "Bot Detected" : "No bot detected";
verdictResult.classList.add(isBot ? "bot" : "safe");
scoreLine.textContent = `${triggered} / ${Object.keys(detectors).length} signals triggered`;

for (const [name, value] of Object.entries(detectors)) {
  const row = document.createElement("div");
  row.className = `detector-row ${value ? "triggered" : "clear"}`;
  row.innerHTML = `
    <span class="detector-name">${name}</span>
    <span class="detector-status ${value ? "triggered" : "clear"}">${value ? "TRIGGERED" : "CLEAR"}</span>
  `;
  container.appendChild(row);
}
console.log("Bot detection results:", detectors);