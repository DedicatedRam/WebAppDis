const crypto = require('crypto');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256');
  hash.update(salt + password);
  const hashedPassword = hash.digest('hex');
  return { salt, hashedPassword };
}


loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const { salt, hashedPassword } = hashPassword(password);

  // In a real scenario, you would send the username, salt, and hashedPassword to the server for verification

  // For this example, let's simulate a successful login
  loginMessage.textContent = "Login successful!";
  loginMessage.style.color = "green";
  setTimeout(() => {
    loginPopup.style.display = "none";
  }, 1500);
});
