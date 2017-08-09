$().ready(function(){

	
	$('#router_battle').on('click', function(e){
		e.preventDefault();
		//get a data structure in which teams information are stored
		
		
		//calculate total numbers of teams
		
		
		//calculate max page number


		//render swig_battle.html with page number 1
		//render template
		var battle_teams = douniu.loadSwigView('swig_battle.html', {
			teams: teams
		});
		

		//load template to content div
		$('.content').html(battle_teams);
		$('#team-detail-modal').modal();
		$('#waiting-modal').modal();

		var pages = {
			totalPage: 10,
	 		pageNumbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
	 		currentPage: 1
		};
		
		//
		var pagination = douniu.loadSwigView('swig_pagination.html', pages);
		console.log(pagination);
		$('#pagination-holder').html(pagination);
	});



	// $('#router_rank').on('click', function(e){
	// 	e.preventDefault();
	// 	//get rank data from database

	// 	//get total page numbers of rank list

	// 	//render page with first page data
	// 	var rank_list = douniu.loadSwigView('swig_rank.html', {
	// 		ranked_list: rank_lists
	// 	});

	// 	$('.content').html(rank_list);

	// 	$('ul.tabs').tabs();
	// });

	$('#router_personal').on('click', function(e){
		e.preventDefault();

		
	});

	$('#router_dataquery').on('click', function(e){
		e.preventDefault();

		var dataquery = douniu.loadSwigView('swig_dataquery.html', {});
		$('.content').html(dataquery);
		
		$('.datepicker').pickadate({
			selectMonths: true, // Creates a dropdown to control month
			selectYears: 15, // Creates a dropdown of 15 years to control year,
			today: 'Today',
			clear: 'Clear',
			close: 'Ok',
			closeOnSelect: true // Close upon selecting a date,
		});
	});
});
