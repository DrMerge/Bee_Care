const submitBtn = document.getElementById("submitBtn");
const URL = "http://localhost:3000/register-patient";

const postDetails = (e) => {
  e.preventDefault();
  const firstname = document.getElementById("fname");
  const lastname = document.getElementById("lname");
  const email = document.getElementById("email");
  const phone_No = document.getElementById("phone");
  const age = document.getElementById("age");
  const address = document.getElementById("address");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");

  const data = {
    firstname: firstname.value,
    lastname: lastname.value,
    email: email.value,
    phone_No: phone_No.value,
    age: age.value,
    address: address.value,
    userPassword: password.value,
  };

  if (data.userPassword != confirmPassword.value) {
    console.log("incorrect password");
  } else {
    return (
      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        // .then((response) => {
        //   response.json();
        // })
        .then((response) => {
          window.location.replace(response.url);
        })
        .catch((err) => {
          console.error("Error in Fetch:", err);
        })
    );
  }
};

submitBtn.addEventListener("click", postDetails);
