$().ready(function(){
	/* ----------------------------------------------
	 * navbar router region
	 * ----------------------------------------------
	 */
	//==============
	//	test data
	//==============
	$('#router_test_page').click(function () {
		$.getScript('/js/jiaz.js');
	})
	$(".home_gr").click(function () {
		$.getScript('/js/leidt.js');
		
	})
	
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
	loadStarter(starter_data);

	$('#router_starter').on('click', function(e){
		e.preventDefault();
		loadStarter(starter_data);
		console.log(userInfo);
	});
	
	// $('#router_battle').on('click', function(e){
	// 	e.preventDefault();
	// 	//get a data structure in which teams information are stored
		
	// 	//calculate total numbers of teams
		
	// 	//calculate max page number

	// 	//render swig_battle.html with page number 1
	// 	//render template
	// 	var battle_teams = bullup.loadSwigView('swig_battle.html', {
	// 		teams: teams
	// 	});
	// 	//load template to content div
	// 	$('.content').html(battle_teams);
	// 	$('#team-detail-modal').modal();
	// 	$('#waiting-modal').modal();
	// 	$.getScript('/js/close_modal.js');
	// 	var pages = {
	// 		totalPage: 10,
	//  		pageNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	//  		currentPage: 1
	// 	};
	// 	//
	// 	var pagination = bullup.loadSwigView('swig_pagination.html', pages);
	// 	//		console.log(pagination);
	// 	$('#pagination-holder').html(pagination);
	// });



	// $('#router_rank').on('click', function(e){
	// 	e.preventDefault();
	// 	//get rank data from database

	// 	//get total page numbers of rank list

	// 	//render page with first page data
	// 	var rank_list = bullup.loadSwigView('swig_rank.html', {
	// 		ranked_list: rank_lists
	// 	});

	// 	$('.content').html(rank_list);

	// 	$('ul.tabs').tabs();
	// });

	// $('#router_personal').on('click', function(e){
	// 	//e.preventDefault();
	// 	var spaPersonalHtml = bullup.loadSwigView('spa_personal.html', {});
	// 	//
	// 	$('.content').html(spaPersonalHtml);
	// });

	$('#router_dataquery').on('click', function(e){
		e.preventDefault();

		var dataquery = bullup.loadSwigView('swig_dataquery.html', {});
		$('.content').html(dataquery);
		
		$('.datepicker').pickadate({
			selectMonths: true, // Creates a dropdown to control month
			selectYears: 15, // Creates a dropdown of 15 years to control year,
			today: 'Today',
			clear: 'Clear',
			close: 'Ok',
			closeOnSelect: true // Close upon selecting a date,
		});

		$.getScript('/js/game_history_query.js');

	});

	$('#router_tournament').on('click', function(e){
		e.preventDefault();
 
		var tournaments_data = [];

		bullup.loadTemplateIntoTarget('swig_tournament.html', tournaments_data, 'main-view');bullup.loadTemplateIntoTarget('swig_tournament.html', tournaments_data, 'main-view');
		$.getScript('/js/await.js');

		
	});

	/* ----------------------------------------------
	 * navbar router region ends here
	 * ----------------------------------------------
	 */
});


function loadStarter(starter_data){
	bullup.loadTemplateIntoTarget('swig_starter.html', starter_data, 'main-view');
}




