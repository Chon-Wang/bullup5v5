$().ready(function(){

	//队伍的模拟数据，用于加载swig_battle.html模板
	var teams = [
		{
			teamName: 'myTeam',
			type: '3',
			rule: 1,
			bet: 30
		},
		{
			teamName: 'your Team',
			type: '4',
			rule: 1,
			bet: 30
		},
		{
			teamName: 'your Team',
			type: '4',
			rule: 1,
			bet: 30
		},
		{
			teamName: 'your Team',
			type: '4',
			rule: 1,
			bet: 30
		}
		
		
	];
	$('#router_dataquery').on('click', function(e){
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
});
