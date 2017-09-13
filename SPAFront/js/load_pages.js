var pageLoader = {};

pageLoader.loadStarterPage = function(){
	//get data for load starter page
	var starter_data = {};
	//load 
	bullup.loadTemplateIntoTarget('swig_starter.html', starter_data, 'main-view');
};

pageLoader.loadTournaments = function(){

	//get data for render tournament

	//
	bullup.loadTemplateIntoTarget('swig_tournament.html', {}, 'main-view');
};
