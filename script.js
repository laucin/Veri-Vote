// data
let voters = JSON.parse(localStorage.getItem("voters")) || [];
let candidates = JSON.parse(localStorage.getItem("candidates")) || [
    { name: "emma", votes: 0 },
    { name: "bolu", votes: 0 },
    { name: "derek", votes: 0 }
];

let votingClosed = localStorage.getItem("votingClosed") === "true";
let currentUser = null;

// save
function saveData() {
    localStorage.setItem("voters", JSON.stringify(voters));
    localStorage.setItem("candidates", JSON.stringify(candidates));
    localStorage.setItem("votingClosed", votingClosed);
}

// page toggle
function showPage(page) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("votePage").style.display = "none";
    document.getElementById("adminPage").style.display = "none";

    document.getElementById(page).style.display = "block";
}

// user entry
function enterVote() {
    let name = document.getElementById("username").value;

    if (!name) return alert("Enter your name!");

    let existing = voters.find(v => v.name === name);

    if (existing && existing.voted) {
        return alert("You already voted!");
    }

    if (!existing) {
        voters.push({ name, voted: false });
    }

    currentUser = voters.find(v => v.name === name);

    document.getElementById("welcome").innerText = "Welcome, " + name;

    showPage("votePage");
    displayCandidates();
}

// display
function displayCandidates() {
    let container = document.getElementById("candidates");
    container.innerHTML = "";

    candidates.forEach((c, i) => {
        container.innerHTML += `
        <div class="candidate">
            <h3>${c.name}</h3>
            <button onclick="vote(${i})">Vote</button>
        </div>
        `;
    });
}

// vote
function vote(index) {
    if (votingClosed) return alert("Voting has ended!");

    if (currentUser.voted) {
        return alert("You already voted!");
    }

    candidates[index].votes++;
    currentUser.voted = true;

    saveData();

    alert("Vote successful!");
}

// admin login
function adminLogin() {
    let user = document.getElementById("adminUser").value;
    let pass = document.getElementById("adminPass").value;

    if (user === "admin" && pass === "1234") {
        showPage("adminPage");
    } else {
        alert("Wrong admin details!");
    }
}

// results
function showResults() {
    let resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    let totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    let winner = candidates.reduce((max, c) => c.votes > max.votes ? c : max);

    resultDiv.innerHTML += `<h3>Total Votes: ${totalVotes}</h3>`;
    resultDiv.innerHTML += `<h3>Leader: ${winner.name}</h3>`;

    candidates.forEach(c => {
        let percent = totalVotes ? ((c.votes / totalVotes) * 100).toFixed(1) : 0;

        resultDiv.innerHTML += `
        <p>${c.name}: ${c.votes} votes (${percent}%)</p>
        `;
    });
}

// finalizing result
function finalizeResults() {
    votingClosed = true;
    saveData();

    let winner = candidates.reduce((max, c) => c.votes > max.votes ? c : max);

    document.getElementById("results").innerHTML = `
        <h2>🏆 WINNER: ${winner.name}</h2>
    `;
}

// logout
function logout() {
    currentUser = null;
    showPage("loginPage");
}

//restart
function restartSystem() {
    if (!confirm("Are you sure you want to restart the system? This will delete all votes.")) {
        return;
    }

    localStorage.clear();

    voters = [];
    candidates = [
        { name: "emma", votes: 0 },
        { name: "bolu", votes: 0 },
        { name: "derek", votes: 0 }
    ];

    votingClosed = false;

    saveData();

    alert("System restarted successfully!");
    location.reload();
}
