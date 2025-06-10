const Authors_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/authors";

fetch(Authors_URL)
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch data");
    return response.json();
  })
  .then(data => {
    const tbody = document.querySelector("#authortable tbody");

    data.forEach(authors => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${authors.author_id}</td>
        <td>${authors.authorname}</td>
        <td>${authors.email}</td>
        <td>${authors.join_date}</td>
      `;

      tbody.appendChild(row);
    });
  })
  .catch(err => {
    console.log(err.message);
  });
