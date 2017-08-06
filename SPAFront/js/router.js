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
		
		// 
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
});
