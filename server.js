const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.static("public"));
//serving the Home page as an entry point
app.use("/home", require("./routes/home"));
app.use("/register-patient", require("./routes/register-patient.js")); // serving the register patiient page
app.use("/auth-patient", require("./routes/auth.js")); // serving the authentication page

app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
