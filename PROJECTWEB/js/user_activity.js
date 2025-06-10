const UserActivity_URL = "https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/user_activity";

fetch(UserActivity_URL)
  .then(response => {
    if (!response.ok) throw new Error("Failed to fetch user activity data");
    return response.json();
  })
  .then(data => {
    const tbody = document.querySelector("#useractivitytable tbody");
    data.forEach(activity => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${activity.activity_id}</td>
        <td>${activity.author_id}</td>
        <td>${activity.activity_type}</td>
        <td>${new Date(activity.activity_time).toLocaleString()}</td>
      `;
      tbody.appendChild(row);
    });
  })
  .catch(err => console.error(err.message));
