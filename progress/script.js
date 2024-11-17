//Alternate proxy url
//"https://cors-anywhere.herokuapp.com/" not public
//https://corsproxy.io/?
const proxyUrl = "https://api.allorigins.win/get?url="; // Proxy URL to bypass CORB

document.getElementById("fetchDataButton").addEventListener("click", fetchData);

function fetchData() {
    // Get usernames from input fields
    const gfgUsername = document.getElementById("gfgUsername").value.trim();
    const leetCodeUsername = document.getElementById("leetCodeUsername").value.trim();

    // Validate inputs
    if (!gfgUsername || !leetCodeUsername) {
        alert("Please enter both GFG and LeetCode usernames.");
        return;
    }

    // Construct API URLs
    const gfgApiUrl = `https://geeks-for-geeks-api.vercel.app/${gfgUsername}`;
    const leetCodeApiUrl = `https://leetcard.jacoblin.cool/${leetCodeUsername}?ext=heatmap&theme=forest`;
    const leetCodeJsonUrl = `https://leetcode-stats-api.herokuapp.com/${leetCodeUsername}`;

    // Encode the GFG API URL
    const encodedGfgUrl = encodeURIComponent(gfgApiUrl);
    const finalGfgUrl = proxyUrl + encodedGfgUrl;

    // Fetch GFG Data
    fetch(finalGfgUrl)
        .then(response => response.json())
        .then(data => {
            const gfgData = JSON.parse(data.contents); // The actual GFG API response is in "contents"
            console.log("GFG Data:", gfgData);

            // Render GFG Data
            document.getElementById("gfgData").innerHTML = `
                <p><strong>User Name:</strong> ${gfgData.info.userName}</p>
                <p><strong>Coding Score:</strong> ${gfgData.info.codingScore}</p>
                <p><strong>Total Problems Solved:</strong> ${gfgData.info.totalProblemsSolved}</p>
                <p><strong>Max Streak:</strong> ${gfgData.info.maxStreak}</p>
                <p><strong>Current Streak:</strong> ${gfgData.info.currentStreak}</p>
                
                <h3>Problem Counts by Category:</h3>
                <ul>
                    <li><strong>School:</strong> ${gfgData.solvedStats.school.count}</li>
                    <li><strong>Basic:</strong> ${gfgData.solvedStats.basic.count}</li>
                    <li><strong>Easy:</strong> ${gfgData.solvedStats.easy.count}</li>
                    <li><strong>Medium:</strong> ${gfgData.solvedStats.medium.count}</li>
                    <li><strong>Hard:</strong> ${gfgData.solvedStats.hard.count}</li>
                </ul>
            `;
        })
        .catch(error => {
            console.error("Error fetching GFG data:", error);
            document.getElementById("gfgData").innerHTML = "<p style='color: red;'>Error fetching GFG data. Please try again later.</p>";
        });

    // Fetch LeetCode Image (Heatmap)
    try {
        const leetCodeOutputDiv = document.getElementById("leetCodeData");

        // Clear any existing content
        leetCodeOutputDiv.innerHTML = "";

        // Create an image element for LeetCode data
        const leetCodeImage = document.createElement("img");
        leetCodeImage.src = leetCodeApiUrl;
        leetCodeImage.alt = "LeetCode User Data";
        leetCodeImage.style = "width: 100%; max-width: 500px; border: 1px solid #ccc;";

        // Append the image to the output div
        leetCodeOutputDiv.appendChild(leetCodeImage);
    } catch (error) {
        console.error("Error fetching LeetCode image:", error);
        document.getElementById("leetCodeData").innerHTML = "<p style='color: red;'>Error fetching LeetCode image. Please try again later.</p>";
    }

    // Fetch LeetCode JSON Data (Text-based)
    fetch(leetCodeJsonUrl)
        .then(response => response.json())
        .then(data => {
            console.log("LeetCode JSON Data:", data);

            // Render LeetCode Data in GFG-like format
            document.getElementById("leetCodeRawOutput").style.display = 'block';
            document.getElementById("leetCodeJsonData").innerHTML = `
                <p><strong>Total Problems Solved:</strong> ${data.totalSolved}</p>
                <p><strong>Total Questions:</strong> ${data.totalQuestions}</p>
                <p><strong>Total Easy Problems Solved:</strong> ${data.easySolved}</p>
                <p><strong>Total Easy Questions:</strong> ${data.totalEasy}</p>
                <p><strong>Total Medium Problems Solved:</strong> ${data.mediumSolved}</p>
                <p><strong>Total Medium Questions:</strong> ${data.totalMedium}</p>
                <p><strong>Total Hard Problems Solved:</strong> ${data.hardSolved}</p>
                <p><strong>Total Hard Questions:</strong> ${data.totalHard}</p>
                <p><strong>Acceptance Rate:</strong> ${data.acceptanceRate}%</p>
                <p><strong>Ranking:</strong> ${data.ranking}</p>
                <p><strong>Contribution Points:</strong> ${data.contributionPoints}</p>
                <p><strong>Reputation:</strong> ${data.reputation}</p>
            `;
        })
        .catch(error => {
            console.error("Error fetching LeetCode JSON data:", error);
            document.getElementById("leetCodeRawOutput").style.display = 'none';
            document.getElementById("leetCodeJsonData").innerHTML = "<p style='color: red;'>Error fetching LeetCode Raw JSON data. Please try again later.</p>";
        });
}
