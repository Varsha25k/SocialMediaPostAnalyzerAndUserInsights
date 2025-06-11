const GET_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/comments";
const POST_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/api/comments";

const tbody = document.querySelector("#commenttable tbody");
const form = document.getElementById("addCommentForm");
let chart;

// Fetch and Display Data
async function fetchComments() {
  try {
    const response = await fetch(GET_URL);
    const data = await response.json();
    renderTable(data);
    renderChart(data);
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

// Render Table
function renderTable(comments) {
  tbody.innerHTML = "";
  comments.forEach(c => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${c.comment_id}</td>
      <td>${c.post_id}</td>
      <td>${c.author_id}</td>
      <td>${c.comment_text}</td>
      <td>${new Date(c.comment_date).toLocaleDateString()}</td>
    `;
    tbody.appendChild(row);
  });
}

// Render Chart (Comments per Post)
function renderChart(comments) {
  const countByPost = {};
  comments.forEach(c => {
    countByPost[c.post_id] = (countByPost[c.post_id] || 0) + 1;
  });

  const labels = Object.keys(countByPost);
  const values = Object.values(countByPost);

  if (chart) chart.destroy();
  const ctx = document.getElementById("commentChart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Comments per Post",
        data: values,
        backgroundColor: "rgba(75, 192, 192, 0.6)"
      }]
    }
  });
}

// Handle Add Comment
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const post_id = document.getElementById("post_id").value.trim();
  const author_id = document.getElementById("author_id").value.trim();
  const comment_text = document.getElementById("content").value.trim();

  if (!post_id || !author_id || !comment_text) return alert("All fields are required.");

  try {
    const response = await fetch(POST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: Number(post_id),
        author_id: Number(author_id),
        comment_text: comment_text
      })
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Failed to add comment");

    console.log("Comment added:", result.comment);

    form.reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("addCommentModal"));
    modal.hide();

    fetchComments();
  } catch (err) {
    alert("Error: " + err.message);
  }
});

// Initial Load
fetchComments();
