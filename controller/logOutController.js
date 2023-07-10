const neo4j = require("neo4j-driver");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const password = process.env.PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const handlelogOut = (req, res) => {
  const session = driver.session({ database: "neo4j" });
  const cookie = req.cookies;

  if (!cookie?.jwt) return res.status(409);

  const refreshToken = cookie.jwt;

  session
    .run(
      `MATCH (patient:PATIENT {refreshToken: $refreshTokenParam}) SET patient.refreshToken = $newRefreshTokenParam RETURN patient AS patient`,
      {
        refreshTokenParam: refreshToken,
        newRefreshTokenParam: 0,
      }
    )
    .then((result) => {
      const patient = result.records[0].get("patient");

      console.log(patient);
      console.log(`\n Log out successful`);
      res.status(200).send("Logged Out");
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = handlelogOut;
