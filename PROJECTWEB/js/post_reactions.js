const PostReactions_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/post_reactions";

fetch(PostReactions_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch post reactions");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#postreactiontable tbody");
    data.forEach(pr => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${pr.id}</td>
        <td>${pr.post_id}</td>
        <td>${pr.author_id}</td>
        <td>${pr.reaction_id}</td>
        <td>${new Date(pr.react_date).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
