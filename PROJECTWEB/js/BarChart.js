let chart;

function loadGraph() {
  const button = document.querySelector("button");
  if (button) {
    button.disabled = true;
    button.textContent = "Loading...";
  }

  fetch('https://silver-space-meme-x5xgjqvrgjqvh9769-5002.app.github.dev/getPostCountByAuthor')
    .then(res => res.json())
    .then(data => {
      const filteredData = data
        .filter(item => item.post_count > 0)
        .sort((a, b) => b.post_count - a.post_count); // Sort descending

      if (filteredData.length === 0) {
        alert("No post data available to display.");
        return;
      }

      const authors = filteredData.map(item => item.author);
      const postCounts = filteredData.map(item => item.post_count);
      const yMax = Math.ceil(Math.max(...postCounts) * 1.2); // 20% padding

      if (chart) {
        chart.data.labels = authors;
        chart.data.datasets[0].data = postCounts;
        chart.options.scales.y.max = yMax;
        chart.update();
      } else {
        const ctx = document.getElementById('postChart').getContext('2d');
        chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: authors,
            datasets: [{
              label: 'Number of Posts',
              data: postCounts,
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              datalabels: {
                anchor: 'end',
                align: 'top',
                color: '#222',
                font: {
                  weight: 'bold'
                },
                formatter: value => Intl.NumberFormat().format(value)  // Format large numbers
              },
              title: {
                display: true,
                text: '📊 Number of Posts Per Author',
                font: {
                  size: 18
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                max: yMax,
                title: {
                  display: true,
                  text: 'Number of Posts'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Authors'
                }
              }
            }
          },
          plugins: [ChartDataLabels]
        });
      }
    })
    .catch(err => {
      console.error("Error loading graph data:", err);
      alert("Failed to load data. Please try again later.");
    })
    .finally(() => {
      if (button) {
        button.disabled = false;
        button.textContent = "🔄 Refresh Chart";
      }
    });
}

document.addEventListener("DOMContentLoaded", loadGraph);
