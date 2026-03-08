const allIssuesUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
const singleIssueUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issue";
const searchIssueUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q";

let allIssues = [];
let currentTab = "all";


// remove active tab style
function removeActiveTab() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.classList.remove("btn-primary");
    button.classList.add("btn-outline");
  });
}

// set active tab style
function setActiveTab(id) {
  removeActiveTab();

  const activeBtn = document.getElementById(id);
  activeBtn.classList.remove("btn-outline");
  activeBtn.classList.add("btn-primary");
}

// issue status check
function getStatusText(issue) {
  if (issue.status) {
    if (issue.status.toLowerCase() === "closed") {
      return "closed";
    } else {
      return "open";
    }
  } else {
    return "open";
  }
}

// card border class
function getBorderClass(status) {
  if (status === "open") {
    return "border-t-4 border-green-500";
  } else {
    return "border-t-4 border-violet-500";
  }
}

// date format
function formatDate(dateString) {
  if (!dateString) {
    return "No date";
  }

  const date = new Date(dateString);

  return date.toLocaleDateString();
}


// spinner manage
function manageSpinner(status) {
  const spinner = document.getElementById("spinner");
  const issuesContainer = document.getElementById("issues-container");

  if (status === true) {
    spinner.classList.remove("hidden");
    issuesContainer.classList.add("hidden");
  } else {
    spinner.classList.add("hidden");
    issuesContainer.classList.remove("hidden");
  }
}

// load all issues from api
function loadIssues() {
  manageSpinner(true);

  fetch(allIssuesUrl)
    .then((res) => res.json())
    .then((data) => {
      allIssues = data.data;
      currentTab = "all";
      setActiveTab("tab-all");
      displayIssues(allIssues);
    });
}

// show all issues
function loadAllIssues() {
  currentTab = "all";
  setActiveTab("tab-all");
  displayIssues(allIssues);
}

// show open issues
function loadOpenIssues() {
  currentTab = "open";
  setActiveTab("tab-open");

  const openIssues = allIssues.filter(
    (issue) => getStatusText(issue) === "open"
  );

  displayIssues(openIssues);
}

// show closed issues
function loadClosedIssues() {
  currentTab = "closed";
  setActiveTab("tab-closed");

  const closedIssues = allIssues.filter(
    (issue) => getStatusText(issue) === "closed"
  );

  displayIssues(closedIssues);
}

// display issues
function displayIssues(issues) {
  const issuesContainer = document.getElementById("issues-container");
  issuesContainer.innerHTML = "";

  document.getElementById("issue-count").innerText = issues.length;

  if (issues.length === 0) {
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center bg-white rounded-xl py-16 space-y-4">
        <p class="text-gray-400 text-xl">No issues found</p>
      </div>
    `;
    manageSpinner(false);
    return;
  }

  issues.forEach((issue) => {
    const status = getStatusText(issue);
    const borderClass = getBorderClass(status);

    const category =
      issue.labels && issue.labels.length > 0 ? issue.labels[0] : "bug";

    const label =
      issue.labels && issue.labels.length > 1
        ? issue.labels[1]
        : "help wanted";

    const author = issue.author ? issue.author : "john_doe";
    const priority = issue.priority ? issue.priority : "low";
    const createdAt = issue.createdAt
      ? formatDate(issue.createdAt)
      : "1/15/2024";
    const titleText = issue.title ? issue.title : "No Title";

    let descriptionText = "No description available";
    if (issue.description) {
      if (issue.description.length > 65) {
        descriptionText = issue.description.slice(0, 200);
      } else {
        descriptionText = issue.description;
      }
    }

    let statusIcon = "";
    if (status === "open") {
      statusIcon = `
        <div class="w-5 h-5 rounded-full border border-green-400 text-green-400 flex justify-center items-center text-[10px]">
          <i class="fa-solid fa-circle-dot text-[8px]"></i>
        </div>
      `;
    } else {
      statusIcon = `
        <div class="w-5 h-5 rounded-full border border-violet-400 text-violet-400 flex justify-center items-center text-[10px]">
          <i class="fa-solid fa-check text-[8px]"></i>
        </div>
      `;
    }

    let priorityHtml = "";
    if (priority.toLowerCase() === "high") {
      priorityHtml = `<span class="bg-red-50 text-red-400 text-[11px] px-4 py-1 rounded-full font-medium uppercase">HIGH</span>`;
    } else if (priority.toLowerCase() === "medium") {
      priorityHtml = `<span class="bg-yellow-50 text-yellow-500 text-[11px] px-4 py-1 rounded-full font-medium uppercase">MEDIUM</span>`;
    } else {
      priorityHtml = `<span class="bg-gray-100 text-gray-400 text-[11px] px-4 py-1 rounded-full font-medium uppercase">LOW</span>`;
    }

    const card = document.createElement("div");
    card.innerHTML = `
      <div onclick="loadIssueDetail(${issue.id})" class="bg-white rounded-md border border-gray-200 shadow-sm cursor-pointer ${borderClass}">
        <div class="p-4 space-y-4">
          <div class="flex justify-between items-start">
            <div>
              ${statusIcon}
            </div>

            <div>
              ${priorityHtml}
            </div>
          </div>

          <div class="space-y-2 min-h-[95px]">
            <h2 class="text-[14px] font-semibold text-slate-800 space-y-5">
              ${titleText}
            </h2>
            <p class="text-[12px] text-slate-400 space-y-5">
              ${descriptionText}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="border bg-yellow-300 text-black text-[10px] px-2 py-1 rounded-full uppercase font-medium">
              ${category}
            </span>

            <span class="border bg-yellow-300 text-black text-[10px] px-2 py-1 rounded-full uppercase font-medium">
              ${label}
            </span>
          </div>
        </div>

        <div class="border-t border-gray-200 px-4 py-3 text-[12px] text-slate-400 space-y-1">
          <p>#${issue.id} by ${author}</p>
          <p>${createdAt}</p>
        </div>
      </div>
    `;

    issuesContainer.append(card);
  });

  manageSpinner(false);
}

// load single issue details
function loadIssueDetail(id) {
  const url = `${singleIssueUrl}/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayIssueDetail(data.data);
    });
}

// display issue details in modal
function displayIssueDetail(issue) {
  const detailsContainer = document.getElementById("details-container");

  const status = getStatusText(issue);
  const category =
    issue.labels && issue.labels.length > 0 ? issue.labels[0] : "bug";
  const label =
    issue.labels && issue.labels.length > 1
      ? issue.labels[1]
      : "help wanted";
  const author = issue.author ? issue.author : "Unknown";
  const priority = issue.priority ? issue.priority : "low";
  const createdAt = issue.createdAt ? formatDate(issue.createdAt) : "No Date";
  const titleText = issue.title ? issue.title : "No Title";
  const descriptionText = issue.description
    ? issue.description
    : "No description available";

  let openedClosedHtml = "";
  if (status === "open") {
    openedClosedHtml = `<span class="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium">Opened</span>`;
  } else {
    openedClosedHtml = `<span class="bg-violet-500 text-white text-xs px-3 py-1 rounded-full font-medium">Closed</span>`;
  }

  let priorityHtml = "";
  if (priority.toLowerCase() === "high") {
    priorityHtml = `<span class="bg-red-500 text-white text-xs px-4 py-1 rounded-full font-medium uppercase">HIGH</span>`;
  } else if (priority.toLowerCase() === "medium") {
    priorityHtml = `<span class="bg-yellow-400 text-white text-xs px-4 py-1 rounded-full font-medium uppercase">MEDIUM</span>`;
  } else {
    priorityHtml = `<span class="bg-gray-400 text-white text-xs px-4 py-1 rounded-full font-medium uppercase">LOW</span>`;
  }

  detailsContainer.innerHTML = `
    <div class="space-y-6">
      <div class="space-y-3">
        <h2 class="text-4xl font-bold text-slate-800">
          ${titleText}
        </h2>

        <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          ${openedClosedHtml}
          <span>•</span>
          <span>Opened by ${author}</span>
          <span>•</span>
          <span>${createdAt}</span>
        </div>
      </div>

      <div class="flex flex-wrap gap-2">
        <span class="border bg-yellow-300 text-black text-[10px] px-2 py-1 rounded-full uppercase font-medium">
          ${category}
        </span>

        <span class="border bg-yellow-300 text-black text-[10px] px-2 py-1 rounded-full uppercase font-medium">
          ${label}
        </span>
      </div>

      <div>
        <p class="text-slate-500 text-xl leading-8">
          ${descriptionText}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-xl">
        <div>
          <p class="text-slate-400 text-lg mb-2">Assignee:</p>
          <h3 class="text-2xl font-semibold text-slate-700">${author}</h3>
        </div>

        <div>
          <p class="text-slate-400 text-lg mb-2">Priority:</p>
          ${priorityHtml}
        </div>
      </div>
    </div>
  `;

  document.getElementById("issue_modal").showModal();
}

// login
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorText = document.getElementById("login-error");

  if (username === "admin" && password === "admin123") {
    errorText.innerText = "";
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("main-section").classList.remove("hidden");
    loadIssues();
  } else {
    errorText.innerText = "Invalid username or password";
  }
});

// search issue
document.getElementById("btn-search").addEventListener("click", function () {
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();

  if (searchValue === "") {
    if (currentTab === "all") {
      loadAllIssues();
    } else if (currentTab === "open") {
      loadOpenIssues();
    } else if (currentTab === "closed") {
      loadClosedIssues();
    }
    return;
  }

  manageSpinner(true);

  const url = `${searchIssueUrl}=${searchValue}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      let searchedIssues = data.data;

      if (currentTab === "open") {
        searchedIssues = searchedIssues.filter(
          (issue) => getStatusText(issue) === "open"
        );
      } else if (currentTab === "closed") {
        searchedIssues = searchedIssues.filter(
          (issue) => getStatusText(issue) === "closed"
        );
      }

      displayIssues(searchedIssues);
    });
});