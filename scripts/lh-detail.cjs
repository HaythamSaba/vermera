const path = require("path");
const r = require(path.resolve(process.cwd(), process.argv[2]));
const ids = process.argv.slice(3);

for (const id of ids) {
  const a = r.audits[id];
  console.log(`\n=== ${id} ===`);
  if (!a) {
    console.log("NOT FOUND");
    continue;
  }
  console.log("score:", a.score, "| displayValue:", a.displayValue);
  console.log("title:", a.title);
  if (a.details?.items) {
    console.log("items:", JSON.stringify(a.details.items, null, 2).slice(0, 3000));
  }
}
