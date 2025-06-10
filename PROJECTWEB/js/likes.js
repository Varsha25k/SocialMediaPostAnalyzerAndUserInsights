const Likes_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/likes";

fetch(Likes_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch likes");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#liketable tbody");
    data.forEach(like => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${like.like_id}</td>
        <td>${like.post_id}</td>
        <td>${like.author_id}</td>
        <td>${like.like_date}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
