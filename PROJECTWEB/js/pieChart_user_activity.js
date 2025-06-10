document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/getActivityDistribution");
    const data = await response.json();

    const labels = data.map(item => item.activity_type);
    const counts = data.map(item => parseInt(item.count));

    const backgroundColors = [
      "#FF6384", "#36A2EB", "#FFCE56", "#8E44AD", "#2ECC71",
      "#E67E22", "#1ABC9C", "#F39C12", "#34495E", "#C0392B"
    ];

    const ctx = document.getElementById("activityChart").getContext("2d");
    new Chart(ctx, {
      type: "pie",
      data: {
        labels: labels,
        datasets: [{
          data: counts,
          backgroundColor: backgroundColors.slice(0, labels.length),
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom"
          },
          title: {
            display: true,
            text: "Distribution of User Activities"
          }
        }
      }
    });
  } catch (err) {
    console.error("Error loading chart:", err);
  }
});
