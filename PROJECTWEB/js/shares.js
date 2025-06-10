const Shares_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/shares";

fetch(Shares_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch shares");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#sharetable tbody");
    data.forEach(share => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${share.share_id}</td>
        <td>${share.post_id}</td>
        <td>${share.author_id}</td>
        <td>${share.share_date}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
