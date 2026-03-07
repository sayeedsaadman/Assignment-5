

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

function loadIssues() {
  manageSpinner(true);

  fetch(allIssuesUrl)
    .then(res => res.json())
    .then(data => {
      allIssues = data.data;
      currentTab = "all";
      setActiveTab("tab-all");
      displayIssues(allIssues);
    });
}

const loadAllIssues = () => {
  currentTab = "all";
  setActiveTab("tab-all");
  displayIssues(allIssues);
};

const loadOpenIssues = () => {
  currentTab = "open";
  setActiveTab("tab-open");

  const openIssues = allIssues.filter(issue => getStatusText(issue) === "open");

  displayIssues(openIssues);
};

const loadClosedIssues = () => {
  currentTab = "closed";
  setActiveTab("tab-closed");

  const closedIssues = allIssues.filter(issue => getStatusText(issue) === "closed");

  displayIssues(closedIssues);
};

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

function getBorderClass(status) {
  if (status === "open") {
    return "border-t-4 border-green-500";
  } else {
    return "border-t-4 border-violet-500";
  }
}


function loadIssueDetail(id) {
  const url = `${singleIssueUrl}/${id}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      displayIssueDetail(data.data);
    });
}

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
        descriptionText = issue.description.slice(0, 65) + "...";
      } else {
        descriptionText = issue.description;
      }
    }

    let statusIcon = "";
    if (status === "open") {
      statusIcon = `
        <div class="w-5 h-5 rounded-full border border-green-400 text-green-400 flex justify-center items-center text-[10px]">
          <i class="fa-solid fa-check text-[8px]"></i>
        </div>
      `;
    } else {
      statusIcon = `
        <div class="w-5 h-5 rounded-full border border-violet-400 text-violet-400 flex justify-center items-center text-[10px]">
          <i class="fa-solid fa-circle-dot text-[8px]"></i>
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
            <h2 class="text-[14px] font-semibold text-slate-800 leading-5">
              ${titleText}
            </h2>
            <p class="text-[12px] text-slate-400 leading-5">
              ${descriptionText}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="border border-red-200 bg-red-50 text-red-400 text-[10px] px-2 py-1 rounded-full uppercase font-medium">
              <i class="fa-regular fa-circle mr-1"></i>${category}
            </span>

            <span class="border border-yellow-300 bg-yellow-50 text-yellow-600 text-[10px] px-2 py-1 rounded-full uppercase font-medium">
              <i class="fa-regular fa-circle mr-1"></i>${label}
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


//seacrh

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
        descriptionText = issue.description.slice(0, 65) + "...";
      } else {
        descriptionText = issue.description;
      }
    }

    let statusIcon = "";
    if (status === "open") {
      statusIcon = `
        <div class="w-5 h-5 rounded-full border border-green-400 text-green-400 flex justify-center items-center text-[10px]">
          <i class="fa-solid fa-check text-[8px]"></i>
        </div>
      `;
    } else {
      statusIcon = `
        <div class="w-5 h-5 rounded-full border border-violet-400 text-violet-400 flex justify-center items-center text-[10px]">
          <i class="fa-solid fa-circle-dot text-[8px]"></i>
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
            <h2 class="text-[14px] font-semibold text-slate-800 leading-5">
              ${titleText}
            </h2>
            <p class="text-[12px] text-slate-400 leading-5">
              ${descriptionText}
            </p>
          </div>

          <div class="flex flex-wrap gap-2">
            <span class="border border-red-200 bg-red-50 text-red-400 text-[10px] px-2 py-1 rounded-full uppercase font-medium">
              <i class="fa-regular fa-circle mr-1"></i>${category}
            </span>

            <span class="border border-yellow-300 bg-yellow-50 text-yellow-600 text-[10px] px-2 py-1 rounded-full uppercase font-medium">
              <i class="fa-regular fa-circle mr-1"></i>${label}
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