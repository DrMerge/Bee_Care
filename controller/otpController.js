const jwt = require("jsonwebtoken");
const neo4j = require("neo4j-driver");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const password = process.env.PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const otpAuth = (req, res) => {
  const otp = req.body.otp;

  const encryptedPhone_No = req.cookies.phone_No;
  console.log(encryptedPhone_No, otp);

  jwt.verify(encryptedPhone_No, process.env.CODE, (err, phone_No) => {
    if (err) return res.status(401);

    client.verify.v2
      .services(process.env.SERVICEID)
      .verificationChecks.create({ to: `+234${phone_No}`, code: otp })
      .then((verification_check) => {
        const session = driver.session({ database: "neo4j" });

        session
          .run(
            `MATCH (patient:PATIENT{phone_No: $phone_NoParam})
                SET patient.phone_NoVerified= $phone_NoVerifiedParam
                RETURN patient AS patient`,
            {
              phone_NoParam: phone_No,
              phone_NoVerifiedParam: true,
            }
          )
          .then((result) => {
            result.records.forEach((record) => {
              const patient = record.get("patient");

              console.log(patient.properties);
              console.log(
                "\n Verification status: " + verification_check.status
              );
              res.status(200).json({ message: `${verification_check.status}` });
            });
          });
      });
  });
};

module.exports = otpAuth;
