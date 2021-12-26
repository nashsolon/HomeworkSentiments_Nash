$(document).ready(() => {
    $('#emotionsChart').toggle();
    $('#sentimentsChart').toggle();
    $('#sliderChart').toggle();
    $('#vader-stackedbar-info').toggle();
    $('#vader-stackedbar-info-text').hide();

    $('#text2emotion-info').toggle();
    $('#text2emotion-info-text').hide();
    $('#slider-title').toggle();
});

$('#text2emotionCharts, #vaderCharts').click(function(d) {
    $(this).children('h3').eq(0).toggleClass('less-margin');
    $(this).children('div').toggle();

});

$('#vaderCharts').click(function(d) {
    $('#slider-title').toggle();
    $('#vader-stackedbar-info').toggle();
    $('#vader-stackedbar-info-text').hide();
});

$('#text2emotionCharts').click(function(d) {
    $('#text2emotion-info').toggle();
    $('#text2emotion-info-text').hide();
});



$('#vader-stackedbar-info').hover(function(d) {
    $('#vader-stackedbar-info-text').toggle();
    // $('#sentimentsChart').toggle();

});

$('#text2emotion-info').hover(function(d) {
    $('#text2emotion-info-text').toggle();
    // $('#sentimentsChart').toggle();

});

// $('.slider-text, .slider-rect').on('mouseover', function(d) {
//     console.log('we want to hover over text and rect')
// });