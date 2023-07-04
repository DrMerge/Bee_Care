const neo4j = require("neo4j-driver");
// const patientNosys = require("../accessories/numberingSys");
const { compareAsc, format } = require("date-fns");
const uri = "neo4j+s://c9994a1e.databases.neo4j.io:7687";
const user = "neo4j";
const bcrypt = require("bcrypt");
const password = "Dr.Merge2331";
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const handleRegister = async (req, res) => {
  const session = driver.session({ database: "neo4j" });

  const registerationDate = format(new Date(), "yyyy-MM-dd");
  const { firstname, lastname, email, phone_No, age, address, userPassword } =
    req.body;

  const hashPassword = await bcrypt.hash(userPassword, 10);

  session // run a cypher query on the database
    .run(
      "MERGE (patient:PATIENT {firstname : $firstnameParam, lastname: $lastnameParam, email: $emailParam,phone_No: $phone_NoParam, age: $ageParam, address: $addressParam, userPassword: $userPasswordParam, emailVerfied: $emailVerifiedParam,refreshToken: $refreshTokenParam, registerationDate: $registerationDateParam}) RETURN patient AS patient ",
      {
        firstnameParam: firstname,
        lastnameParam: lastname,
        emailParam: email,
        phone_NoParam: phone_No,
        ageParam: age,
        addressParam: address,
        userPasswordParam: hashPassword,
        emailVerifiedParam: false,
        refreshTokenParam: 0,
        registerationDateParam: registerationDate,
      }
    )
    .then((result) => {
      result.records.forEach((record) => {
        console.log(record.get("patient"));
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => session.close());

  res.status(201);
};

module.exports = handleRegister;
