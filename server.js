require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const cors = require("cors");
const { logger } = require("./middleware/logEvent");
const verifyJWT = require("./middleware/verifyJWT");

const PORT = process.env.PORT || 3000;

const whitelist = [
  "https://www.yoursite.com",
  "http://127.0.0.1:5500",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use(logger);
app.use(cors(corsOptions));
//serving the Home page as an entry point
app.use("/home", require("./routes/home"));

app.use("/register-patient", require("./routes/register-patient.js")); // serving the register patiient page
app.use("/otp", require("./routes/otp.js"));
app.use("/auth-patient", require("./routes/auth.js")); // serving the authentication page
app.use("/auth-patient", require("./routes/auth.js"));
app.use("/refresh", require("./routes/refresh.js"));
app.use("/log-out", require("./routes/logOut.js"));
app.use(verifyJWT);
app.use("/patient-homePage", require("./routes/patientPage/homePage"));

app.use(require("./middleware/logError"));
app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});
