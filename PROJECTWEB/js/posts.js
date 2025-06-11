const GET_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/posts";
const POST_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/api/posts";

const tbody = document.querySelector("#posttable tbody");
const form = document.getElementById("addPostForm");
let chart;

// Fetch and Display Data
async function fetchPosts() {
  try {
    const response = await fetch(GET_URL);
    const data = await response.json();
    renderTable(data);
    renderChart(data);
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

// Render Table
function renderTable(posts) {
  tbody.innerHTML = "";
  posts.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.post_id}</td>
      <td>${p.author_id}</td>
      <td>${p.content}</td>
      <td>${new Date(p.post_date).toLocaleDateString()}</td>
    `;
    tbody.appendChild(row);
  });
}

// Render Chart (Posts per Author)
function renderChart(posts) {
  const countByAuthor = {};
  posts.forEach(p => {
    countByAuthor[p.author_id] = (countByAuthor[p.author_id] || 0) + 1;
  });

  const labels = Object.keys(countByAuthor);
  const values = Object.values(countByAuthor);

  if (chart) chart.destroy();
  const ctx = document.getElementById("postChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Posts per Author",
        data: values,
        backgroundColor: "rgba(255, 99, 132, 0.6)"
      }]
    }
  });
}

// Handle Add Post
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const author_id = document.getElementById("author_id").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!author_id || !content) return alert("All fields are required.");

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author_id: Number(author_id), content })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to add post");

    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("addPostModal"));
    modal.hide();

    fetchPosts();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Initial Load
fetchPosts();
