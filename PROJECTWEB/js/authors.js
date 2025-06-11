const GET_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/authors";
const POST_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/api/authors";

const tbody = document.querySelector("#authortable tbody");
const form = document.getElementById("addAuthorForm");
let chart;

// Fetch and Display Data
async function fetchAuthors() {
  try {
    const response = await fetch(GET_URL);
    const data = await response.json();
    renderTable(data);
    renderChart(data);
  } catch (err) {
    console.error("Error fetching authors:", err);
  }
}

// Render Table
function renderTable(authors) {
  tbody.innerHTML = "";
  authors.forEach(a => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${a.author_id}</td>
      <td>${a.authorname}</td>
      <td>${a.email}</td>
      <td>${new Date(a.join_date).toLocaleDateString()}</td>
    `;
    tbody.appendChild(row);
  });
}

// Render Chart
function renderChart(authors) {
  const counts = {};
  authors.forEach(a => {
    const date = new Date(a.join_date).toLocaleDateString();
    counts[date] = (counts[date] || 0) + 1;
  });

  const labels = Object.keys(counts);
  const values = Object.values(counts);

  if (chart) chart.destroy();
  const ctx = document.getElementById("authorChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Authors Joined",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    }
  });
}

// Add Author Form Submit
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const authorname = document.getElementById("authorname").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!authorname || !email) return alert("Both fields are required.");

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorname, email })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to add author");

    document.getElementById("addAuthorForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("addAuthorModal"));
    modal.hide();

    fetchAuthors(); // Refresh table & chart
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Initial Load
fetchAuthors();
