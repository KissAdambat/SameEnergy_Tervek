const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

document.getElementById("showRegister").addEventListener("click", () => {
  loginSection.hidden = true;
  registerSection.hidden = false;
  message.textContent = "";
});

document.getElementById("showLogin").addEventListener("click", () => {
  registerSection.hidden = true;
  loginSection.hidden = false;
  message.textContent = "";
});

function getResponseMessage(response, body) {
  if (body && typeof body === "object") {
    return body.message || body.Message || body.error || body.title || "";
  }

  return typeof body === "string" ? body : "";
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) {
    return "";
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;
  const submitButton = loginForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;

  try {
    const url = `https://localhost:7181/User/GetAUser/${encodeURIComponent(email)}/${encodeURIComponent(password)}`;
    const response = await fetch(url);
    const body = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        getResponseMessage(response, body) ||
          `Sign in failed (HTTP ${response.status}).`,
      );
    }

    message.textContent =
      getResponseMessage(response, body) || "Sign in successful.";
  } catch (error) {
    message.textContent =
      error instanceof TypeError
        ? "Could not connect to the server. Check that the API is running."
        : error.message;
  } finally {
    submitButton.disabled = false;
  }
});

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";

  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const submitButton = registerForm.querySelector('button[type="submit"]');
  const passwordRequirements =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (!name) {
    message.textContent = "Enter your name.";
    return;
  }

  if (!email.includes("@")) {
    message.textContent = "Enter a valid email address containing @.";
    return;
  }

  if (!passwordRequirements.test(password)) {
    message.textContent =
      "Password must be at least 8 characters and include an uppercase letter, a number and a special character.";
    return;
  }

  if (password !== confirmPassword) {
    message.textContent = "The passwords do not match.";
    return;
  }

  submitButton.disabled = true;

  try {
    const response = await fetch("https://localhost:7181/User/AddUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const body = await readResponse(response);

    if (!response.ok) {
      throw new Error(
        getResponseMessage(response, body) ||
          `Registration failed (HTTP ${response.status}).`,
      );
    }

    message.textContent =
      getResponseMessage(response, body) ||
      "Registration successful. You can now sign in.";
    registerForm.reset();
    registerSection.hidden = true;
    loginSection.hidden = false;
  } catch (error) {
    message.textContent =
      error instanceof TypeError
        ? "Could not connect to the server. Check that the API is running."
        : error.message;
  } finally {
    submitButton.disabled = false;
  }
});