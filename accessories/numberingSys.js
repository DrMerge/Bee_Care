const fs = require("fs");
const path = require("path");

const generatePatientNumber = () => {
  let count = fs.readFileSync(
    path.join(__dirname, "models", "count.txt"),
    "utf8"
  );
  count = Number(count);
  count++;
  fs.writeFileSync(
    path.join(__dirname, "models", "count.txt"),
    count.toString()
  );
  return count.toString().padStart(7, "0");
};

module.exports = generatePatientNumber;
