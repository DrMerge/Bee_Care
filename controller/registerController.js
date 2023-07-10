const neo4j = require("neo4j-driver");
// const patientNosys = require("../accessories/numberingSys");
const { compareAsc, format } = require("date-fns");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN
);

const password = process.env.PASSWORD;
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const handleRegister = async (req, res) => {
  const session = driver.session({ database: "neo4j" });

  const registerationDate = format(new Date(), "yyyy-MM-dd");
  const { firstname, lastname, email, phone_No, age, address, userPassword } =
    req.body;

  session
    .run(
      `MATCH (patient:PATIENT ) 
    WHERE patient.email= $emailParam OR patient.phone_No= $phone_NoParam
    RETURN patient AS patient
    `,
      {
        emailParam: email,
        phone_NoParam: phone_No,
      }
    )
    .then(async (result) => {
      const record = result.records[0];
      if (record) {
        const duplicate = record.get("patient");
        if (duplicate) {
          return res.status(409).json({ message: "Patient already exists" });
        }
      }
      const hashPassword = await bcrypt.hash(userPassword, 10);

      session // run a cypher query on the database
        .run(
          "MERGE (patient:PATIENT {firstname : $firstnameParam, lastname: $lastnameParam, email: $emailParam,phone_No: $phone_NoParam, age: $ageParam, address: $addressParam, userPassword: $userPasswordParam, phone_NoVerfied: $phone_NoVerifiedParam,refreshToken: $refreshTokenParam, registerationDate: $registerationDateParam}) RETURN patient AS patient ",
          {
            firstnameParam: firstname,
            lastnameParam: lastname,
            emailParam: email,
            phone_NoParam: phone_No,
            ageParam: age,
            addressParam: address,
            userPasswordParam: hashPassword,
            phone_NoVerifiedParam: false,
            refreshTokenParam: 0,
            registerationDateParam: registerationDate,
          }
        )
        .then((result2) => {
          result2.records.forEach((record2) => {
            const patient = record2.get("patient");

            const encryptedPhone_No = jwt.sign(
              patient.properties.phone_No,
              process.env.CODE
            );

            client.verify.v2
              .services(process.env.SERVICEID)
              .verifications.create({ to: `+234${phone_No}`, channel: `sms` })
              .then((verification) => {
                console.log(verification.status);
              });

            console.log(encryptedPhone_No);
            res
              .status(201)
              .cookie("phone_No", encryptedPhone_No, { maxAge: 3600 * 1000 }) // Expires after 1 hour

              .redirect("http://localhost:3000/otp");
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    });
};

module.exports = handleRegister;
