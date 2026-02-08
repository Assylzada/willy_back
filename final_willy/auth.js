// Switch between Sign Up and Log In
function showLogin() {
  document.getElementById("signupBox").classList.add("hidden");
  document.getElementById("loginBox").classList.remove("hidden");
}

function showSignup() {
  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("signupBox").classList.remove("hidden");
}

// ---------------------------
// 📘 Sign Up Function (register on backend)
// ---------------------------
async function signUp() {
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!name || !email || !password) {
    alert("⚠️ Please fill in all fields.");
    return;
  }
  if (!emailPattern.test(email)) {
    alert("❌ Please enter a valid email address.");
    return;
  }
  if (!passwordPattern.test(password)) {
    alert("❌ Password must be 8+ chars, include 1 uppercase & 1 number.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Registration failed");

    alert("✅ Account created successfully! Please log in now.");
    showLogin();
  } catch (err) {
    alert("❌ " + err.message);
  }
}

// ---------------------------
// 🔐 Log In Function (backend auth)
// ---------------------------
async function logIn() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    // Save token and user info
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name || "");

    alert("✅ Login successful!");
    window.location.href = "willy.html";
  } catch (err) {
    alert("❌ " + err.message);
  }
}
