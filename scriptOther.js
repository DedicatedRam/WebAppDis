async function hashPassword(password) {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);

  const encoder = new TextEncoder();
  const passwordData = encoder.encode(password);
  const combinedData = new Uint8Array(salt.length + passwordData.length);
  combinedData.set(salt);
  combinedData.set(passwordData, salt.length);

  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
  const hashedPassword = Array.from(new Uint8Array(hashBuffer)).map(byte => byte.toString(16).padStart(2, '0')).join('');

  return { salt: Array.from(salt), hashedPassword };
}

function goToRegPage(){
  window.location.href = "register.html";
}


async function loginSubmit(){
  const userName = document.getElementById('userInpUserName').value;
  console.log(document.getElementById('userInpPassword').value);
  const pass = hashPassword(document.getElementById('userInpPassword').value);
  console.log(pass);
  const params = {userName, pass};
  console.log(pass);
  fetch("https://cas-4d0.pages.dev/getUsers",{
    method: "POST",
    body: JSON.stringify(params),
  })
  .then((response) => response.json())
    .then((data) =>{
      console.log(data);
    }).catch((error) => console.error(error));


}

function showLoginForm() {
  var form = document.getElementById("loginForm");
  form.style.animationName = "slideUp";
}
function hideLoginForm() {
  var form = document.getElementById("loginForm");
  form.style.animationName = "slideDown";
  form.style.bottom = "-100%"; // hide the form off screen
}

function register() {
  const form = document.getElementById("registration-form");

  const username = sanitizeInput(form.querySelector('input[type="email"]').value);
  const phoneNumber = sanitizeInput(form.querySelector('input[type="tel"]').value);
  const password = hashPassword(sanitizeInput(form.querySelector('input[type="password"]').value));

  const jsonObject = {
    email: username,
    phoneNumber: phoneNumber,
    password: password
  };
  console.log(JSON.stringify(jsonObject));

  postUser(jsonObject);

  form.reset();
}

async function postUser(jsnOb){
  try {
    const response = await fetch("https://cas-4d0.pages.dev/putUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsnOb),
    })
      .then((response) => {
        // Log the response content
        return response.text(); // or response.blob() if it's not text
      })
      .then((content) => {
        console.log("Response Content:", content);
        // Now, try to parse the content as JSON
        try {
          const data = JSON.parse(content);
          console.log(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      })
      .catch((error) => console.error(error));
  } catch(error){
    console.error(error);
  }


}


function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

