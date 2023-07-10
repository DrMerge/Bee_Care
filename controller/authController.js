const neo4j = require("neo4j-driver");
const { compareAsc, format } = require("date-fns");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const password = process.env.PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const handleAuth = async (req, res) => {
  const session = driver.session({ database: "neo4j" });

  const { phone_No, password } = req.body;

  try {
    const result = await session.run(
      "MATCH (n:PATIENT { phone_No: $phone_NoParam }) RETURN n AS patient",
      {
        phone_NoParam: phone_No,
      }
    );

    const record = result.records[0];
    if (!record) {
      return res.status(409).json({ message: "User not found" });
    }

    const retrievedPatient = record.get("patient");

    if (!retrievedPatient.properties.phone_NoVerified) {
      return res.status(401).json({ message: "Phone Number Not yet verified" });
    }

    const match = await bcrypt.compare(
      password,
      retrievedPatient.properties.userPassword
    );

    if (!match) {
      return res.status(409).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      {
        phone_No: retrievedPatient.properties.phone_No,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "600s" }
    );
    const refreshToken = jwt.sign(
      { phone_No: retrievedPatient.properties.phone_No },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "2d" }
    );

    await session
      .run(
        "MATCH (patient:PATIENT { phone_No: $phone_NoParam }) SET patient.refreshToken= $refreshTokenParam   RETURN patient AS patient",
        {
          phone_NoParam: phone_No,
          refreshTokenParam: refreshToken,
        }
      )
      .then(() => {
        console.log("Patient has been authorised");
        res
          .status(200)
          .cookie("jwt", refreshToken)
          .json({ accessToken: accessToken });
      });
  } catch (error) {
    console.error("Error executing Cypher query:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = handleAuth;
