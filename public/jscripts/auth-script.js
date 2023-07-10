const submitBtn = document.getElementById("submitBtn");
const URL = "http://localhost:3000/auth-patient";

const postDetails = (e) => {
  e.preventDefault();
  const phone_No = document.getElementById("email_or_username");
  const password = document.getElementById("password");

  const data = {
    phone_No: phone_No.value,
    password: password.value,
  };

  return fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      response.json();
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error("Error in Fetch:", error);
    });
};

submitBtn.addEventListener("click", postDetails);
