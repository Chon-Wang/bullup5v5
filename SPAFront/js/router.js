$().ready(function(){
	loadStarter();

	$("#router_personal").click(function () {
		$.getScript('/js/leidt.js');
	});

	$('#router_starter').on('click', function(e){
		//e.preventDefault()
		loadStarter();
	});

	$('#router_dataquery').on('click', function(e){
		e.preventDefault();
		socket.emit("LOLKeyRequest");
		
		// var dataquery = bullup.loadSwigView('swig_dataquery.html', {});
		// $('.content').html(dataquery);
		// $('.datepicker').pickadate({
		// 	selectMonths: true, // Creates a dropdown to control month
		// 	selectYears: 15, // Creates a dropdown of 15 years to control year,
		// 	today: 'Today',
		// 	clear: 'Clear',
		// 	close: 'Ok',
		// 	closeOnSelect: true // Close upon selecting a date,
		// });
		// $.getScript('/js/game_history_query.js');
	});

	$('#router_tournament').on('click', function(e){
		bullup.alert("程序猿正在玩命开发中ε=ε=ε=ε=ε=ε=┌(￣◇￣)┘");
		//e.preventDefault();
		// var tournaments_data = [];
		// bullup.loadTemplateIntoTarget('swig_tournament.html', tournaments_data, 'main-view');
	});

	
});

function loadStarter(){
	var starter_data = {
		tournaments:[
			{
				name:'S7 Championship',
				description: 'Starting at October'
			},
			{
				name:'MSI Championship',
				description: 'Starting at May'
			}
			
		],
		news:[
			{
				title: 'New champion coming soon'
			},
			{
				title: 'Arcade 2017 Overview'
			}
		]
	};
	//加载html
	var starterHtml = bullup.loadSwigView('swig_starter.html', starter_data);
	$('#main-view').html(starterHtml);
	var starterShufflingViewHtml = bullup.loadSwigView('swig_starter_shuffling_view.html', null);
	$('#starter_shuffling_view').html(starterShufflingViewHtml);

	//加载主页的动效js
	$.getScript('./js/starter.js');
}




