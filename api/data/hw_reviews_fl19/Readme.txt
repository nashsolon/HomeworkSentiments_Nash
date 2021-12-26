This data was created on 09/07/2021. This data is for WashU internal use only. Do not share this data publicly. Contact Marion Neumann m.neumann@wustl.edu for questions.  





We used the following script:

#!/usr/bin/env bash

echo $BASH_VERSION

# semester
SEMESTER=fl19

# USE BASH 4!!!
# https://stackoverflow.com/questions/1494178/how-to-define-hash-tables-in-bash
# https://clubmate.fi/upgrade-to-bash-4-in-mac-os-x
#run by caling:  bash create_review_dataset.sh


# where the student repositories are (absolute path)
#repo_directory='/Users/marion/Documents/Teaching/CSE427/'$SEMESTER'/SVN_students/'
#base_directory='/Users/marion/Documents/Teaching/CSE427/'$SEMESTER'/'
#result_directory='/Users/marion/Documents/Teaching/CSE427/'$SEMESTER'/hw_reviews_'${SEMESTER}
repo_directory='/Users/marion/Teaching/CSE427/'$SEMESTER'/SVN_students/'
base_directory='/Users/marion/Teaching/CSE427/'$SEMESTER'/'
result_directory='/Users/marion/Teaching/CSE427/'$SEMESTER'/hw_reviews_'${SEMESTER}

# make or empty directory for results
if [ -d ${base_directory}/hw_reviews_${SEMESTER} ]; then
    rm -r ${base_directory}/hw_reviews_${SEMESTER}/*
fi

echo $base_directory

mkdir -p ${base_directory}/hw_reviews_${SEMESTER}/1_stars/
mkdir -p ${base_directory}/hw_reviews_${SEMESTER}/2_stars/
mkdir -p ${base_directory}/hw_reviews_${SEMESTER}/3_stars/
mkdir -p ${base_directory}/hw_reviews_${SEMESTER}/4_stars/
mkdir -p ${base_directory}/hw_reviews_${SEMESTER}/5_stars/
mkdir -p ${base_directory}/hw_reviews_${SEMESTER}/not_labeled/


# create annonymous ID - wustlkey lookup
declare -A student_lookup

while read student;
do
    read -ra array <<< "$student"
    wustl_key="${array[0]}"
    id=$(uuidgen)
    id=${id:0:6}
    student_lookup[$wustl_key]=$id

    #echo ${student_lookup[$wustl_key]}    # id

done <logins.txt

echo "...reading/writing grades..."
# make de-identified grades csv ${SEMESTER}_grades.csv from grades.csv
rm ${result_directory}/${SEMESTER}_grades.csv

while IFS=, read -r wustl_key hw1 hw2 hw3 hw4 hw5 hw6 hw7 hw8 hw9 exam final_project participation quiz_score course_score course_grade
#while IFS=, read -r wustl_key hw1 hw2 hw3 hw4 hw5 hw6 hw7 hw8 hw9 exam final_project participation quiz_score course_score course_grade
do
    id=${student_lookup[$wustl_key]}
    #echo $wustl_key $id $hw1
    printf '%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n' $id $hw1 $hw2 $hw3 $hw4 $hw5 $hw6 $hw7 $hw8 $hw9 $exam $final_project $participation $quiz_score $course_score $course_grade >> ${result_directory}/${SEMESTER}_grades.csv
done < raw/grades.csv

echo "...reading/writing demogrophics..."
# make de-identified demogrophics csv ${SEMESTER}_demogrophics.csv from demogrophics.csv
rm ${result_directory}/${SEMESTER}_demogrophics.csv

while IFS=, read -r wustl_key standing primeMP	primeMPName	progCode2	progName2	gender ehnicity	raceCode consent
do
    id=${student_lookup[$wustl_key]}
    #echo $wustl_key $id $standing
    printf '%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n' $id $standing $primeMP	$primeMPName	$progCode2	$progName2	$gender $ehnicity	$raceCode $consent >> ${result_directory}/${SEMESTER}_demogrophics.csv
done < raw/demographics.csv


echo "...reading star ratings..."
declare -A rating_lookup

while IFS="", read sid wkey hw rating
do
    wustl_key_hw="$wkey"_"$hw"
    rating_lookup[$wustl_key_hw]=$rating
    echo ${rating_lookup[$wustl_key_hw]}    # id

    ##folder=${rating}"_stars"

    ### consider only files larger then 0 bytes
    ##if [ -s ${repo_directory}/${wkey}/hw${hw}/hw${hw}_review.txt ] ; then
    ##    cp ${repo_directory}/${wkey}/hw${hw}/hw${hw}_review.txt ${result_directory}/${folder}/hw${hw}_review_${id}.txt
    ##fi

done < raw/StarRating_wustlkey.csv




pushd ${repo_directory} > /dev/null 2>&1

# loop through all student repos
for repo in */
do
    # strip trailing / from directory name
    wustl_key=$(sed 's/\/$//' <<< ${repo})
    echo ${wustl_key}
    id=${student_lookup[$wustl_key]}

    #pushd ${repo_directory}/${wustl_key}/lab11/ > /dev/null 2>&1
    #cp review_labels.txt ..
    pushd ${wustl_key} > /dev/null 2>&1

    for hw_folder in */
    do
        # strip trailing / from directory name
        hw=$(sed 's/\/$//' <<< ${hw_folder})
        wustl_key_hw=${wustl_key}_${hw}
        echo "======"
        echo ${wustl_key_hw}
        # get ground truth labels (if exists)
        echo ${rating_lookup[$wustl_key_hw]}

        # check if rating exists
        if [ ${rating_lookup[$wustl_key_hw]+aaa} ] ; then
            #echo 'labels exist: ' ${rating_lookup[$wustl_key_hw]}

            folder=${rating_lookup[$wustl_key_hw]}
            folder="$(echo $folder | head -c 1)"
            #echo $folder
            #cat ${hw}/${hw}_reflection.txt
            # consider only files larger then 0 bytes
            if [ -s ${hw}/${hw}_reflection.txt ] ; then
                cp ${hw}/${hw}_reflection.txt ${result_directory}/${folder}_stars/${hw}_review_${id}.txt
            fi
        else
            #echo ${wustl_key_hw}
            echo 'labels: NO'
            # consider only files larger then 0 bytes
            if [ -s ${hw}/${hw}_reflection.txt ] ; then
                # copy review files from student repository to data directory (not_labeled folder)
                #echo ${hw}/${hw}_reflection.txt
                echo 'review: YES'
                cp ${hw}/${hw}_reflection.txt ${result_directory}/not_labeled/${hw}_review_${id}.txt
            else
                echo 'review: NO'
            fi

        fi
    done

    popd > /dev/null 2>&1

done
