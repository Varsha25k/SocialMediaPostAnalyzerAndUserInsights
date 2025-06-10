const Hashtags_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/hashtags";

fetch(Hashtags_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch hashtags");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#hashtagtable tbody");
    data.forEach(hashtag => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${hashtag.hashtag_id}</td>
        <td>${hashtag.tag_name}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
