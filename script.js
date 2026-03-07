document.getElementById("login-btn").addEventListener("click", () => {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    document.getElementById("login-error").innerText = "";
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-section").classList.remove("hidden");
  } else {
    alert("UserName & Password is Incorrect");
  }
});