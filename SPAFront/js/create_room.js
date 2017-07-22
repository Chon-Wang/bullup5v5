$(document).ready(function(){

	$("#create_room").click(function(){
		$("#create_room_modal").css("display","block");

		var dateTime = new Date($.now());

		$("#create_date_time").text(dateTime);
	});

	$("#create_close").click(function(){
		$("#create_room_modal").css("display", "none");
	});
});
