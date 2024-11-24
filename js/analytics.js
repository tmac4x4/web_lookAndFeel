const ctx = document.getElementById('topDramaChart');

new Chart(ctx,{
    type: 'bar',
    data: {
        labels: ['Before Sunrise','Boyhood','Sideways','Her','Being John Malkovich'],
        datasets: [{
            label: 'Score',
            data: [10,9,8,8,7],
            backgroundColor: 'rgba(178, 34, 34, 0.7)', // Orange color with slight transparency
            borderColor: 'rgba(178, 34, 34, 1)', // Solid orange border
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
        
    }
});