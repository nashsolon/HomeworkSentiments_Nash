let sentimentsFromData = (data, sem) => {
    // console.log(data);
    sem = sem.toLowerCase();
    if (sem != 'all') {
        data = data.filter((d) => {
            return d.semester == sem;
        });
    }
    let info = {};
    for (let d of data) {
        let thing = { 'neg': d.neg, 'neu': d.neu, 'pos': d.pos, 'compound': d.compound, 'rating': d.rating };
        if (!info[d.hw_num]) {
            info[d.hw_num] = []
        }
        info[d.hw_num].push(thing);
    }
    let avgs = {};
    for (let k of Object.keys(info)) {
        avgs[k] = { 'neg': 0, 'neu': 0, 'pos': 0, 'compound': 0, 'rating': 0 };
    }
    for (let hw of Object.keys(info)) {
        for (let col of Object.keys(info[hw][0])) {
            for (let rev of info[hw]) {
                avgs[hw][col] += !isNaN(rev[col]) ? rev[col] : 0;
            }
        }
    }
    for (let a of Object.keys(avgs)) {
        let t = avgs[a];
        for (let g of Object.keys(t)) {
            t[g] = t[g] / info[a].length;
        }
    }
    return avgs;
}

let emotionsFromData = (data, sem) => {
    // console.log(data);
    sem = sem.toLowerCase();
    if (sem != 'all') {
        data = data.filter((d) => {
            return d.semester == sem;
        });
    }
    let info = {};
    for (let d of data) {
        let thing = { 'happy': d.Happy, 'angry': d.Angry, 'surprise': d.Surprise, 'sad': d.Sad, 'fear': d.Fear, 'rating': d.rating };
        if (!info[d.hw_num]) {
            info[d.hw_num] = []
        }
        info[d.hw_num].push(thing);
    }
    let avgs = {};
    for (let k of Object.keys(info)) {
        avgs[k] = { 'happy': 0, 'angry': 0, 'surprise': 0, 'sad': 0, 'fear': 0, 'rating': 0 };
    }
    for (let hw of Object.keys(info)) {
        for (let col of Object.keys(info[hw][0])) {
            for (let rev of info[hw]) {
                avgs[hw][col] += !isNaN(rev[col]) ? rev[col] : 0;
            }
        }
    }
    for (let a of Object.keys(avgs)) {
        let t = avgs[a];
        for (let g of Object.keys(t)) {
            t[g] = t[g] / info[a].length;
        }
    }
    return avgs;
}

let starFreqsFromData = (data, sem, hw) => {
    // console.log(data, sem, hw);
    sem = sem.toLowerCase();
    if (sem != 'all') {
        data = data.filter((d) => {
            return d.semester == sem;
        });
    }
    if (hw != 'all') {
        data = data.filter((d) => {
            return d.hw_num == hw;
        });
    }
    let obj = {};
    for (let d of data) {
        let cat = d.rating.toString();
        if (obj[cat]) {
            obj[cat] += 1;
        } else {
            obj[cat] = 1;
        }
    }
    let requiredKeys = ["NaN", "1", "2", "3", "4", "5"];
    for (let r of requiredKeys) {
        if (!obj[r]) obj[r] = 0;
    }
    return obj;
}

let reviewsFromDataSentiments = (d, sem, hw, rating) => {
    // console.log(d_emotions)
    sem = sem.toLowerCase();
    let data = JSON.parse(JSON.stringify(d));
    if (sem != 'all') {
        data = data.filter((d) => {
            return d.semester == sem;
        });
    }
    if (hw != 'all') {
        data = data.filter((d) => {
            return d.hw_num == hw;
        });
    }
    // console.log(data);
    if (rating != 'all') { // * This might not work due to the rating being an int not a string,
        // * might have to do some casting or smtg if problems
        data = data.filter((d) => {
            if (isNaN(rating)) {
                return !d.rating;
            }
            return d.rating == rating;
        })
    }
    // let obj = {};
    data.forEach((e) => {
            // delete e.student_id;
            // let keys = ['student_id', 'neg', 'pos', 'neu', 'compound', 'Unnamed: 0', ''];
            let keys = ['student_id', 'Unnamed: 0', ''];

            for (let key of keys)
                delete e[key];
        })
        // console.log(data);
    return data;
}


let reviewsFromDataEmotions = (d_emotions, sem, hw, rating) => {

    sem = sem.toLowerCase();
    let data = JSON.parse(JSON.stringify(d_emotions));
    // console.log(data)
    if (sem != 'all') {
        data = data.filter((d) => {
            return d.semester == sem;
        });
    }
    if (hw != 'all') {
        data = data.filter((d) => {
            return d.hw_num == hw;
        });
    }

    // console.log(data);
    if (rating != 'all') { // * This might not work due to the rating being an int not a string,
        // * might have to do some casting or smtg if problems
        data = data.filter((d) => {
            if (isNaN(rating)) {
                return !d.rating;
            }
            return d.rating == rating;
        })
    }
    // let obj = {};
    // console.log(data)
    data.forEach((e) => {
            // delete e.student_id;
            // let keys = ['student_id', 'neg', 'pos', 'neu', 'compound', 'Unnamed: 0', ''];
            let keys = ['student_id', 'Unnamed: 0', '', 'Rating', 'hw_num', 'rating', 'semester', 'review'];

            for (let key of keys)
                delete e[key];
        })
        // console.log(data);
    return data;

}

let reviewsFromDataSE = (reviewsDataSentiment, reviewsDataEmotions) => {
    let sent_hw = ''
    let emote_hw = ''
    let full_obj = {}
    let reviewsData = []
    console.log(reviewsDataSentiment.length)
    for (let i = 0; i < reviewsDataSentiment.length; i++) {
        sent_hw = reviewsDataSentiment[i]
        emote_hw = reviewsDataEmotions[i]

        full_obj = {...sent_hw, ...emote_hw }
            // console.log(full_obj)

        reviewsData.push(full_obj)
    }
    return reviewsData
        // console.log(reviewsData)
}