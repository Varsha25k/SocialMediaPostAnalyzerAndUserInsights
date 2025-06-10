const Posts_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/posts";

fetch(Posts_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  })
  .then(data => {
    const tbody = document.querySelector("#posttable tbody");
    data.forEach(post => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${post.post_id}</td>
        <td>${post.author_id}</td>
        <td>${post.content}</td>
        <td>${post.post_date}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.log(err.message));
