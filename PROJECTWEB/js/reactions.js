const Reactions_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/reactions";

fetch(Reactions_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch reactions");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#reactiontable tbody");
    data.forEach(reaction => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${reaction.reaction_id}</td>
        <td>${reaction.reaction_type}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
