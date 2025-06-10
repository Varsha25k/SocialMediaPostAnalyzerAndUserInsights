const PostHashtags_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/post_hashtags";

fetch(PostHashtags_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch post hashtags");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#posthashtagtable tbody");
    data.forEach(item => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.id}</td>
        <td>${item.post_id}</td>
        <td>${item.hashtag_id}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
