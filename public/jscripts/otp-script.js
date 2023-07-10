const submitBtn = document.getElementById("submitBtn");
const URL = "http://localhost:3000/otp";

const postDetails = (e) => {
  e.preventDefault();

  const otp = document.getElementById("otp").value;

  fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ otp: otp }),
  })
    .then((response) => {
      window.location.replace(response.url);
    })
    .catch((err) => {
      console.error("Error in Fetch:", err);
    });
};

submitBtn.addEventListener("click", postDetails);
