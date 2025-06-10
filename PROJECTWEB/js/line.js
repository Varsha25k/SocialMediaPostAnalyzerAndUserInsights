document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/posts-over-time");
    const data = await response.json();

    const labels = data.map(row => row.month);
    const counts = data.map(row => row.post_count);

    const ctx = document.getElementById("postsLineChart").getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Posts per Month",
          data: counts,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: "Number of Posts" }
          },
          x: {
            title: { display: true, text: "Month" }
          }
        }
      }
    });
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
});
