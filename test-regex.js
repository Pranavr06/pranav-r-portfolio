const content = `Academic Context & Guidance
---------------------------

This project was developed as part of a **1st year internship** under the expert guidance of:

![Ms. Ashwitha C Thomas](..//assets/ashwitha-thomas.webp)

### Ms. Ashwitha C Thomas

**Role:** Former Assistant Professor (Grade-I)

**Institution:** NMAM Institute of Technology (NMAMIT), Nitte`;

let displayContent = content.replace(/!\[([^\]]+)\]\(([^)]+)\)(?:\r?\n)+###\s+([^\n]+)(?:\r?\n)+\*\*Role:\*\*\s*([^\n]+)(?:\r?\n)+\*\*Institution:\*\*\s*([^\n]+)/g, (match, alt, src, name, role, institution) => {
  console.log("MATCHED!");
  return `\n<div class="report-box">\n  <div class="report-box-flex">\n    <img src="${src}" alt="${alt}" class="report-box-img" loading="lazy" />\n    <div>\n      <h3 class="report-box-title">${name}</h3>\n      <p class="report-box-role"><strong>Role:</strong> ${role}</p>\n      <p class="report-box-institution"><strong>Institution:</strong> ${institution}</p>\n    </div>\n  </div>\n</div>\n`;
});

console.log(displayContent);
