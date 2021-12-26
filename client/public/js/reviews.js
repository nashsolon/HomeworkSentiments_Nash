function Reviews() {
    this.init();
}

Reviews.prototype.init = function() {
    let revs = this;
    revs.display_count = 5;
    $('#more-reviews').click(() => {
        console.log("MORE REVIEWS");
        revs.display_count += 5;
        revs.update();
    });
    // console.log(revs.display_count);
    // vis.data = 
}

Reviews.prototype.setData = function(data) {
    // console.log(data);

    // -> https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        let currentIndex = array.length,
            randomIndex;

        // While there remain elements to shuffle...
        while (currentIndex != 0) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]
            ];
        }

        return array;
    }

    this.data = shuffle(data);
    this.display_count = 5;
}

Reviews.prototype.update = function() {
    // console.log(data);
    let revs = this;

    // console.log(revs.display_count)

    let theseReviews = revs.data.slice(0, revs.display_count);
    // console.log(theseReviews)

    $('#reviews').empty();

    for (let rev of theseReviews) {
        // let reviewEl = 
        // '<div class="review"></div>'
        let otherclass = "";
        if (!rev.rating) {
            otherclass = " left";
        }
        // * This builds a single review based on the contents of `rev`
        $('#reviews')
            .append(
                $('<div/>', { 'class': 'review' })
                .append(
                    $('<div/>', { 'class': 'top-bar' })
                    .append('<p class="rev-sem">' + rev.semester.toUpperCase() + '</p>')
                    .append('<p class="rev-hw' + otherclass + '">' + rev.hw_num.toUpperCase() + '</p>')
                    .append(
                        $('<div/>', { 'class': 'rev-stars' })
                        .append(() => {
                            let ans = '';
                            for (let j = 0; j < rev.rating; j++)
                                ans += '<i class="fas fa-star"></i>';
                            return ans;
                        })
                    )
                )
                .append(
                    $('<p class="rev-text">' + rev.review + '</p>')

                )
                .append(() => {
                        if (rev.compound > 0.05) {
                            return $('<p class="rev-sent"> Compound VADER Score: ' + rev.compound + ' (positive) </p>')
                        } else if (rev.compound < 0.05) {
                            return $('<p class="rev-sent"> Compound VADER Score: ' + rev.compound + ' (negative) </p>')
                        } else {
                            return $('<p class="rev-sent"> Compound VADER Score: ' + rev.compound + ' (neutral) </p>')
                        }


                    }



                )
                .append(() => {
                        let highest_emotion = ''
                        let emotions = ['Angry', 'Fear', 'Happy', 'Sad', 'Surprise']
                        for (let first_emotion of emotions) {
                            for (let second_emotion of emotions) {
                                if (rev[first_emotion] > rev[second_emotion]) {
                                    highest_emotion = first_emotion
                                }

                            }
                        }
                        // console.log(rev)
                        // console.log(highest_emotion)
                        return $('<p class="rev-emotion"> Predominant Emotion: ' + highest_emotion + ' (' + rev[highest_emotion] + ')</p>')
                    }


                )
            );


        // reviewEl.append('<div class="top-bar"></div>')

    }

}