const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(salt + password);
  const hashedPassword = hash.digest('hex');
  return { salt, hashedPassword };
}

async function loginSubmit(){
  const userName = document.getElementById('userInpUserName').value;
  const pass = hashPassword(document.getElementById('userInpPassword').value);
  const params = {userName, pass};
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


// loginForm.addEventListener("submit", async (event) => {
//   event.preventDefault();

//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   const { salt, hashedPassword } = hashPassword(password);

//   // In a real scenario, you would send the username, salt, and hashedPassword to the server for verification

//   // For this example, let's simulate a successful login
//   loginMessage.textContent = "Login successful!";
//   loginMessage.style.color = "green";
//   setTimeout(() => {
//     loginPopup.style.display = "none";
//   }, 1500);
// });
