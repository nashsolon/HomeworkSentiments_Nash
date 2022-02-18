let files = ['data/reviews_sentiment.csv', 'data/reviews_emotion.csv']
let promises = []
files.forEach((f) => promises.push(d3.csv(f)))


Promise.all(promises).then((v) => {

    [reviews_sentiment, reviews_emotions] = v;

    // * Convert numeric columns
    let sent_numeric_cols = ['compound', 'neg', 'neu', 'pos', 'rating'];
    reviews_sentiment.forEach((f) => {
        for (c of sent_numeric_cols) {
            f[c] = +f[c];
        }
    });

    // * Convert numeric columns
    let emo_numeric_cols = ['Angry', 'Fear', 'Happy', 'Sad', 'Surprise', 'Rating'];
    reviews_emotions.forEach((f) => {
        for (c of emo_numeric_cols) {
            f[c] = +f[c];
        }
    });

    // * These are our filters on the data
    let curSem = 'all';
    let curHW = 'all';
    let curRating = 'all';

    // * Create the sentimentsChart
    let sentimentCols = ['pos', 'neu', 'neg'];
    let sentimentLegendLabels = ['positive', 'neutral', 'negative'];
    let sentimentsChart = new StackedBarChart('#sentimentsChart', sentimentCols, sentimentLegendLabels, 'sentiments');
    let sentimentsData = sentimentsFromData(reviews_sentiment, 'all');
    sentimentsChart.update(sentimentsData, 'sentiments');

    // * Create the emotionsChart
    // let emotionCols = ['angry', 'fear', 'happy', 'sad', 'surprise'];
    // let emotionLegendLabels = ['angry', 'afraid', 'happy', 'sad', 'surprised']
    // let emotionsChart = new StackedBarChart('#emotionsChart', emotionCols, emotionLegendLabels, 'emotions');
    // let emotionsData = emotionsFromData(reviews_emotions, 'all');
    // emotionsChart.update(emotionsData, 'emotions');

    // * Create the sliderChart
    let sliderChart = new SliderChart();
    let sliderInfo = sliderChartInfo(reviews_sentiment, 'all');
    sliderChart.initial(sliderInfo);

    // * Create the SelectHW
    let selectHw = new SelectHW();
    // console.log(Object.keys(sentimentsData));
    selectHw.update(Object.keys(sentimentsData));

    // * Create the starHistogram 
    let starHistogram = new StarHistogram();
    let starsData = starFreqsFromData(reviews_sentiment, 'all', 'all');
    starHistogram.update(starsData);

    // * Create the reviews
    let reviews = new Reviews();
    let reviewsDataSentiment = reviewsFromDataSentiments(reviews_sentiment, 'all', 'all', 'all')
    let reviewsDataEmotions = reviewsFromDataEmotions(reviews_emotions, 'all', 'all', 'all')
    let reviewsData = reviewsFromDataSE(reviewsDataSentiment, reviewsDataEmotions)
    reviews.setData(reviewsData);
    reviews.update();

    // * Update the main page
    let update = () => {

        sentimentsData = sentimentsFromData(reviews_sentiment, curSem);
        sentimentsChart.update(sentimentsData, 'sentiments');

        emotionsData = emotionsFromData(reviews_emotions, curSem);
        emotionsChart.update(emotionsData, 'emotions')

        sliderInfo = sliderChartInfo(reviews_sentiment, curSem);
        sliderChart.transition(sliderInfo);

        selectHw.update(Object.keys(sentimentsData));

        starsData = starFreqsFromData(reviews_sentiment, curSem, curHW);
        starHistogram.update(starsData);

        reviewsDataSentiment = reviewsFromDataSentiments(reviews_sentiment, curSem, curHW, curRating)
        reviewsDataEmotions = reviewsFromDataEmotions(reviews_emotions, curSem, curHW, curRating)
        reviewsData = reviewsFromDataSE(reviewsDataSentiment, reviewsDataEmotions)
        reviews.setData(reviewsData);
        reviews.update();

        // * If the rating is NaN, don't display stars on the review
        // if (curRating != 'all' && isNaN(curRating)) {
        //     $('.rev-hw').css('right', '325px');
        // }
    };

    // * If a semester is clicked {'all', 'fl18', 'fl19'}
    $('#select-sem p').click(function() {

        if ($(this).attr('id') == curSem)
            return;

        $(this).removeClass('des');
        $(this).addClass('sel');

        $(this).siblings().removeClass('sel');
        $(this).siblings().addClass('des');

        curSem = $(this).attr('id');
        update();
    });

    // * If a rating is clicked on the starHistogram
    $('#starHistogram').on('updateStars', (e, rating) => {
        curRating = rating;
        update();
    });

    $('#select-hw').on('updateHw', (e, hw) => {
        // console.log(hw);
        curHW = hw;
        update();
    });

    $('#shuffle').on('click', () => update());

    // curHw = hw; update();
});