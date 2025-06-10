let pieChart;

function loadReactionPieChart() {
  const button = document.querySelector("button");
  if (button) {
    button.disabled = true;
    button.textContent = "Loading...";
  }

  fetch("https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/top-reactions")
    .then(res => res.json())
    .then(data => {
      if (!data.length) {
        alert("No reaction data available.");
        return;
      }

      const labels = data.map(item => item.reaction_type);
      const counts = data.map(item => item.count);
      const backgroundColors = [
        "#4dc9f6", "#f67019", "#f53794", "#537bc4", "#acc236", "#166a8f"
      ];

      if (pieChart) {
        pieChart.data.labels = labels;
        pieChart.data.datasets[0].data = counts;
        pieChart.update();
      } else {
        const ctx = document.getElementById("reactionChart").getContext("2d");
        pieChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: labels,
            datasets: [{
              label: "Reaction Distribution",
              data: counts,
              backgroundColor: backgroundColors,
              borderColor: "#fff",
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right"
              },
              title: {
                display: true,
                text: "🎯 Reaction Type Distribution",
                font: {
                  size: 18
                }
              },
              datalabels: {
                color: "#000",
                formatter: (value, ctx) => {
                  const total = ctx.chart._metasets[0].total;
                  const percent = ((value / total) * 100).toFixed(1);
                  return percent + "%";
                }
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      }
    })
    .catch(err => {
      console.error("Error loading reaction pie chart:", err);
      alert("Failed to load data. Try again later.");
    })
    .finally(() => {
      if (button) {
        button.disabled = false;
        button.textContent = "🔄 Refresh Chart";
      }
    });
}

document.addEventListener("DOMContentLoaded", loadReactionPieChart);
