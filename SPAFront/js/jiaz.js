var clock = $('.countdown-clock').FlipClock(60, {
    // ... your options here
    clockFace: 'MinuteCounter',
    countdown: true
});

$('#my_collapsible').collapsible('open', 0);
$('#my_collapsible').collapsible('open', 1);
$('#my_collapsible').collapsible('open', 2);

$('#component_collapsible').collapsible('open', 0);
$('#component_collapsible').collapsible('open', 1);
$('#component_collapsible').collapsible('open', 2);



var my_data = [9.5, 88, 39, 20, 30, 88];
var component_data = [99, 18, 99, 67, 99, 89];

drawRadarWithData(my_data, component_data, 'teams-radar-chart');




