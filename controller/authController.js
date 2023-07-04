const neo4j = require("neo4j-driver");
const { compareAsc, format } = require("date-fns");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const password = "Dr.Merge2331";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const handleAuth = async (req, res) => {
  const session = driver.session({ database: "neo4j" });

  const { email, password } = req.body;

  try {
    const result = await session.run(
      "MATCH (n:PATIENT { email: $emailParam}) RETURN n AS patient",
      {
        emailParam: email,
      }
    );

    const record = result.records[0];
    if (!record) {
      return res.status(409).json({ message: "User not found" });
    }

    const retrievedPatient = record.get("patient");

    const match = await bcrypt.compare(
      password,
      retrievedPatient.properties.userPassword
    );

    if (!match) {
      return res.status(409).json({ message: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { user: retrievedPatient },
      process.env.ACCESS_TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { user: retrievedPatient },
      process.env.REFRESH_TOKEN_SECRET
    );

    await session.run(
      "MATCH (patient:PATIENT { email: $emailParam}) SET patient.refreshToken = $refreshTokenParam",
      {
        emailParam: email,
        refreshTokenParam: refreshToken,
      }
    );

    res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    console.error("Error executing Cypher query:", error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    console.log("User has been authenticated");
  }
};

module.exports = handleAuth;
