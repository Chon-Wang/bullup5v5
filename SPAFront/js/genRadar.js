function drawRadarWithData(my_data, rival_data, canvas_name) {
	window.chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};


	var chartColors = window.chartColors;
	var color = Chart.helpers.color;

	if (my_data.length >= 6 && component_data.length >= 6) {

		var my_config = {
			type: 'radar',
			data: {
				labels: ["综合", "KDA", "发育", "推进", "生存", "输出"],
				datasets: [{
					label: "我方",
					backgroundColor: color(window.chartColors.red).alpha(0.2).rgbString(),
					borderColor: window.chartColors.blue,
					pointBackgroundColor: window.chartColors.blue,
					data: [
                    my_data[0],
                    my_data[1],
                    my_data[2],
                    my_data[3],
                    my_data[4],
                    my_data[5]
                ]
            }, {
					label: "对方",
					backgroundColor: color(window.chartColors.blue).alpha(0.2).rgbString(),
					borderColor: window.chartColors.red,
					pointBackgroundColor: window.chartColors.red,
					data: [
                    component_data[0],
                    component_data[1],
                    component_data[2],
                    component_data[3],
                    component_data[4],
                    component_data[5]
                ]
            }, ]
			},
			options: {
				legend: {
					position: 'top',
				},
				title: {
					display: true,
					text: '队伍对比'
				},
				scale: {
					ticks: {
						beginAtZero: true
					}
				}
			}
		};
	}

	window.myRadar = new Chart(document.getElementById(canvas_name), my_config);

}
