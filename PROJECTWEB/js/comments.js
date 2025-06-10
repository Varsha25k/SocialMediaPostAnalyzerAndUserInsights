const Comments_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/comments";

fetch(Comments_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch comments");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#commenttable tbody");
    data.forEach(comment => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${comment.comment_id}</td>
        <td>${comment.post_id}</td>
        <td>${comment.author_id}</td>
        <td>${comment.comment_text}</td>
        <td>${comment.comment_date}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
