const neo4j = require("neo4j-driver");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const jwt = require("jsonwebtoken");
const password = process.env.PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const handleRefresh = (req, res) => {
  const session = driver.session({ database: "neo4j" });
  const cookie = req.cookies;

  if (!cookie?.jwt) return res.status(409);

  const refreshToken = cookie.jwt;

  session
    .run(
      `MATCH (patient:PATIENT {refreshToken: $refreshTokenParam}) RETURN patient AS patient`,
      {
        refreshTokenParam: refreshToken,
      }
    )
    .then((result) => {
      const patient = result.records[0].get("patient");

      if (!patient) return res.status(401);

      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
          if (err) return res.status(403);
          if (decoded.phone_No != patient.properties.phone_No)
            return res.status(403);

          const accessToken = jwt.sign(
            { phone_No: patient.properties.phone_No },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "600s" }
          );

          res.status(200).json({ accessToken: accessToken });
        }
      );
    });
};
module.exports = handleRefresh;
