
let voters = JSON.parse(localStorage.getItem("voters")) || [];
let candidates = JSON.parse(localStorage.getItem("candidates")) || [
    { name: "Alice", votes: 0 },
    { name: "Bob", votes: 0 },
    { name: "Charlie", votes: 0 },
    { name: "David", votes: 0 }
];

let votingClosed = localStorage.getItem("votingClosed") === "true";
let currentUser = null;



function saveData() {
    localStorage.setItem("voters", JSON.stringify(voters));
    localStorage.setItem("candidates", JSON.stringify(candidates));
    localStorage.setItem("votingClosed", votingClosed);
}



function validateMatric(matric) {
    // Pattern: letters/letters/2-digit year/numbers
    // e.g. VUG/SEN/25/14827
    const pattern = /^[A-Z]{2,5}\/[A-Z]{2,5}\/\d{2}\/\d{3,6}$/i;
    return pattern.test(matric.trim());
}



function showPage(page) {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("votePage").style.display  = "none";
    document.getElementById("adminPage").style.display = "none";
    document.getElementById(page).style.display = "block";
}



function enterVote() {
    let matric = document.getElementById("matricInput").value.trim().toUpperCase();

    if (!matric) {
        return alert("Please enter your matric number!");
    }

    if (!validateMatric(matric)) {
        return alert(
            "Invalid matric number format!\n\n" +
            "Correct format: SCHOOL/COURSE/YEAR/SERIALNO\n" +
            "Example: VUG/SEN/25/14827"
        );
    }

    let existing = voters.find(v => v.matric === matric);

    if (existing && existing.voted) {
        return alert("This matric number has already been used to vote!");
    }

    if (!existing) {
        voters.push({ matric: matric, voted: false });
    }

    currentUser = voters.find(v => v.matric === matric);

    document.getElementById("welcome").innerText   = "Welcome, Voter!";
    document.getElementById("matricDisplay").innerText = "Matric No: " + matric;

    showPage("votePage");
    displayCandidates();
}



function displayCandidates() {
    let container = document.getElementById("candidates");
    container.innerHTML = "";

    if (votingClosed) {
        container.innerHTML = `<p style="color:red; font-weight:bold;">Voting has been closed.</p>`;
        return;
    }

    candidates.forEach((c, i) => {
        container.innerHTML += `
        <div class="candidate">
            <h3>${c.name}</h3>
            <button onclick="vote(${i})">Vote</button>
        </div>
        `;
    });
}



function vote(index) {
    if (votingClosed) return alert("Voting has ended!");

    if (currentUser.voted) return alert("You have already voted!");

    candidates[index].votes++;
    currentUser.voted = true;

    saveData();

    alert("✅ Vote cast successfully!");

    // Refresh to show voted state
    displayCandidates();
    document.getElementById("candidates").innerHTML +=
        `<p style="color:green; font-weight:bold;">Thank you! Your vote has been recorded.</p>`;
}



function adminLogin() {
    let user = document.getElementById("adminUser").value;
    let pass = document.getElementById("adminPass").value;

    if (user === "admin" && pass === "1234") {
        showPage("adminPage");
    } else {
        alert("Wrong admin credentials!");
    }
}



function showResults() {
    let resultDiv = document.getElementById("results");
    resultDiv.innerHTML = "";

    let totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    let winner     = candidates.reduce((max, c) => c.votes > max.votes ? c : max);

    resultDiv.innerHTML += `
        <h3>Total Votes: ${totalVotes}</h3>
        <h3>Current Leader: ${winner.name}</h3>
    `;

    candidates.forEach(c => {
        let percent = totalVotes ? ((c.votes / totalVotes) * 100).toFixed(1) : 0;
        resultDiv.innerHTML += `<p>${c.name}: ${c.votes} votes (${percent}%)</p>`;
    });
}



function showVoters() {
    let voterDiv = document.getElementById("voterList");
    voterDiv.innerHTML = "<h3>Registered Voters</h3>";

    if (voters.length === 0) {
        voterDiv.innerHTML += "<p>No voters yet.</p>";
        return;
    }

    voters.forEach((v, i) => {
        voterDiv.innerHTML += `
        <div class="voter-entry">
            <strong>#${i + 1}</strong> — ${v.matric}
            <span style="float:right; color:${v.voted ? 'green' : 'orange'}">
                ${v.voted ? "✅ Voted" : "⏳ Pending"}
            </span>
        </div>
        `;
    });

    let voted    = voters.filter(v => v.voted).length;
    let notVoted = voters.length - voted;

    voterDiv.innerHTML += `
        <p style="margin-top:15px;">
            <strong>Total Registered:</strong> ${voters.length} |
            <strong style="color:green">Voted: ${voted}</strong> |
            <strong style="color:orange">Pending: ${notVoted}</strong>
        </p>
    `;
}



function finalizeResults() {
    if (!confirm("Are you sure you want to finalize and close voting?")) return;

    votingClosed = true;
    saveData();

    let totalVotes = candidates.reduce((sum, c) => sum + c.votes, 0);
    let winner     = candidates.reduce((max, c) => c.votes > max.votes ? c : max);
    let percent    = totalVotes ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0;

    document.getElementById("results").innerHTML = `
        <h2>🏆 WINNER: ${winner.name}</h2>
        <p>${winner.votes} votes (${percent}% of total)</p>
        <p>Total votes cast: ${totalVotes}</p>
    `;
}



function logout() {
    currentUser = null;
    document.getElementById("matricInput").value = "";
    showPage("loginPage");
}



function restartSystem() {
    if (!confirm("Are you sure you want to restart? This will delete ALL votes and voters.")) return;

    localStorage.clear();

    voters = [];
    candidates = [
        { name: "Alice",   votes: 0 },
        { name: "Bob",     votes: 0 },
        { name: "Charlie", votes: 0 },
        { name: "David",   votes: 0 }
    ];

    votingClosed = false;
    currentUser  = null;

    saveData();
    alert("✅ System restarted successfully!");
    location.reload();
}
