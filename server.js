require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const { logger } = require("./middleware/logEvent");

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));
app.use(logger);
//serving the Home page as an entry point
app.use("/home", require("./routes/home"));

app.use("/register-patient", require("./routes/register-patient.js")); // serving the register patiient page
app.use("/otp", require("./routes/otp.js"));
app.use("/auth-patient", require("./routes/auth.js")); // serving the authentication page
app.use("/auth-patient", require("./routes/auth.js"));
app.use("/refresh", require("./routes/refresh.js"));
app.use("/log-out", require("./routes/logOut.js"));

app.use(require("./middleware/logError"));
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
