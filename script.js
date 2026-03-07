

const allIssuesUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const singleIssueUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issue";
const searchIssueUrl =
  "https://phi-lab-server.vercel.app/api/v1/lab/issues/search";

let allIssues = [];
let currentTab = "all";

const removeActiveTab = () => {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
    btn.classList.add("btn-primary");
  });
};

const setActiveTab = (id) => {
  removeActiveTab();

  const activeBtn = document.getElementById(id);
  activeBtn.classList.remove("btn-outline");
  activeBtn.classList.add("btn-primary");
};


const manageSpinner = (status) => {
  if (status == true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("issues-container").classList.add("hidden");
  } else {
    document.getElementById("spinner").classList.add("hidden");
    document.getElementById("issues-container").classList.remove("hidden");
  }
};








document.getElementById("login-btn").addEventListener("click", () => {

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === "admin" && password === "admin123") {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-section").classList.remove("hidden");
  } else {
    alert("UserName & Password is Incorrect");
  }
});