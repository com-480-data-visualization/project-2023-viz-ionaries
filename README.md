# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
| -------------- | ------ |
| Nicolas Termote | 301581|
| | |
| | |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

This is a preliminary milestone to let you set up goals for your final project and assess the feasibility of your ideas.
Please, fill the following sections about your project.

*(max. 2000 characters per section)*

### Dataset

> Find a dataset (or multiple) that you will explore. Assess the quality of the data it contains and how much preprocessing / data-cleaning it will require before tackling visualization. We recommend using a standard dataset as this course is not about scraping nor data processing.
>
> Hint: some good pointers for finding quality publicly available datasets ([Google dataset search](https://datasetsearch.research.google.com/), [Kaggle](https://www.kaggle.com/datasets), [OpenSwissData](https://opendata.swiss/en/), [SNAP](https://snap.stanford.edu/data/) and [FiveThirtyEight](https://data.fivethirtyeight.com/)), you could use also the DataSets proposed by the ENAC (see the Announcements section on Zulip).


We decided to use two datasets from Kaggle in the topic of beer. These two datasets put together give us a lot of usefull information concerning the beer types, breweries, aromatic profiles and rating. These datasets are organized as follows :

#### 1- [Breweries, reviews : ](https://www.kaggle.com/datasets/ankurnapa/brewery-dataset?select=beers.csv)

- beers.csv : 
    - id : beer tag
    - name : beer name
    - brewery_id : brewery tag
    - state : state of origin
    - country : country of origin
    - style : beer style
    - availability : seasonal availability of the beer
    - abv : Alcohol by Volume, alcohol percentage in beer
    - notes : notes about the beer
    - retired : Whether the beer is still available (False), or is out of the market (True) 

- breweries.csv
    - id : brewery tag
    - name : brewery name
    - city : brewery city of origin
    - state : brewery state of origin
    - country : brewery country of origin
    - notes : notes about the brewery
    - types : type of establishment (Brewery, Bar, Shop, etc.)

- reviews.csv
    - beer_id : beer tag
    - username : username of the reviewer
    - date : date of the review
    - text : text of the review
    - look : look score
    - smell : smell score
    - taste : taste score
    - feel : feel score
    - overall : overall score
    - score : average of the scores for this beer

#### 2- [Beer Aromas (Tasting profiles): ](https://www.kaggle.com/datasets/stephenpolozoff/top-beer-information)

- beer_data_set.csv

    - Name : Beer name
    - key : Unique key given to each beer
    - Style : Beer style
    - Style Key : Unique key given to each style
    - Brewery : Beer's source, the brewery
    - Description : Information on the beer if available
    - ABV : Alcohol by Volume
    - Ave Rating : Average rating of a beer
    - Min IBU : Minimum value for IBU (International Bitterness Unit), a measure for bitterness
    - Max IBU : Maximum value for IBU (International Bitterness Unit), a measure for bitterness
    - Astringency : Astringency tasting score
    - Body : Body tasting score
    - Alcohol : Alcoholic tasting score
    - Bitter : Bitterness  tasting score
    - Sweet : Sweetness tasting score
    - Sour : Sourness tasting score
    - Salty : Saltiness tasting score
    - Fruits : Fruity tasting score
    - Hoppy : Hoppy tasting score (Herbal and floral, taste of hops)
    - Spices : Spiciness tasting score
    - Malty : Maltiness tasting score

### Problematic

> Frame the general topic of your visualization and the main axis that you want to develop.
> - What am I trying to show with my visualization?
> - Think of an overview for the project, your motivation, and the target audience.

Our problematic is to identify the key factors that contribute to a beer's popularity and how those factors vary by beer style, flavor profile, and brewery.

We will explore which beer styles are the most popular among consumers and how their flavour profiles differ from one another, and if a certain flavour profile has better reviews in each style. We will also analyze how consumers' reviews vary by beer origin and whether certain breweries have a better reputation than others. We could also look at how review trends can affect the popularity of certain beer types, or if seasons have an effect on beer preference by consumers

Our motivation for this project is to help beer enthusiasts and industry professionals gain a deeper understanding of the beer market and consumer preferences. We believe that our findings will be useful for brewery owners, beer distributors, beer critics, and consumers who are interested in learning more about different beer styles and flavour profiles.


### Exploratory Data Analysis

> Pre-processing of the data set you chose
> - Show some basic statistics and get insights about the data

### Related work


> - What others have already done with the data?
> - Why is your approach original?
> - What source of inspiration do you take? Visualizations that you found on other websites or magazines (might be unrelated to your data).
> - In case you are using a dataset that you have already explored in another context (ML or ADA course, semester project...), you are required to share the report of that work to outline the differences with the submission for this class.

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone

