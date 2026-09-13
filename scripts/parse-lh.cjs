const path = require("path");
const r = require(path.resolve(process.cwd(), process.argv[2]));

console.log("=== SCORES ===");
for (const [key, cat] of Object.entries(r.categories)) {
  console.log(key, "=", Math.round(cat.score * 100));
}

console.log("\n=== FAILING / NOT-APPLICABLE-SKIP AUDITS PER CATEGORY ===");
for (const [key, cat] of Object.entries(r.categories)) {
  console.log(`\n--- ${key} ---`);
  for (const ref of cat.auditRefs) {
    const audit = r.audits[ref.id];
    if (!audit) continue;
    if (audit.score === null || audit.score === 1) continue; // skip N/A and passing
    console.log(
      `[${ref.weight}pt] ${audit.id}: score=${audit.score} — ${audit.title}`,
    );
    if (audit.displayValue) console.log(`    displayValue: ${audit.displayValue}`);
  }
}
