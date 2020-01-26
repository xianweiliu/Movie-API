const autoCompleteConfig = {
    // rendering the data from the api and do some validation with it.
    renderOption(movie) {
        // check and see if the poster is url exist or not
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        // return the src and title, and year of the movie
        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },
    // return the movie title for own use
    inputValue(movie) {
        return movie.Title;
    },
    async fetchData(searchTerm) {
        const res = await axios.get("http://www.omdbapi.com/", {
            // by creating this object it will auto appened these values to the url
            params: {
                apikey: "bff1ca7e",
                s: searchTerm,
            },
        });
        // dealing with api Errors -> that's within the api
        if (res.data.Error) {
            // return an empty array
            return [];
        }
        // return data
        return res.data.Search;
    },
};

createAutoComplete({
    // take all the config object and pass to here
    ...autoCompleteConfig,
    root: document.querySelector("#left-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        // create another fetch call and passed the current selected movie
        // pass in the selector to tell it where it should render the data.
        onMovieSelect(movie, document.querySelector("#left-summary"), "left");
    },
});

createAutoComplete({
    ...autoCompleteConfig,
    root: document.querySelector("#right-autocomplete"),
    onOptionSelect(movie) {
        document.querySelector(".tutorial").classList.add("is-hidden");
        // create another fetch call and passed the current selected movie
        // pass in the selector to tell it where it should render the data.
        onMovieSelect(movie, document.querySelector("#right-summary"), "right");
    },
});

let leftMovie;
let rightMovie;

// fetch data from the that particular movie with detailed info
const onMovieSelect = async (movie, summaryElement, side) => {
    const res = await axios.get("http://www.omdbapi.com/", {
        // by creating this object it will auto appened these values to the url
        params: {
            i: movie.imdbID,
            apikey: "bff1ca7e",
        },
    });
    // select the element that we wanted to add content, and pass the data to the template that created below
    summaryElement.innerHTML = movieTemplate(res.data);
    // determine the search results belongs to left or right
    side === "left" ? (leftMovie = res.data) : (rightMovie = res.data);
    // check if these two having data, and run the comparsion.
    if (leftMovie && rightMovie) runComparsion();
};

const runComparsion = () => {
    // select the articles
    const leftSideStats = document.querySelectorAll(
        "#left-summary .notification",
    );
    const rightSideStats = document.querySelectorAll(
        "#right-summary .notification",
    );

    // iterate through the articles
    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        // extract the data-value from each article and set it conver it to string
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        // comparing these two values
        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove("is-primary");
            leftStat.classList.add("is-warning");
        } else {
            rightStat.classList.remove("is-primary");
            rightStat.classList.add("is-warning");
        }
    });
};

// created detailed template for the Movie that is selected
const movieTemplate = movieDetail => {
    // checking if the data is N/A, if it does, set the data-value to 0
    let dollars;
    if (movieDetail.BoxOffice !== "N/A") {
        dollars = parseInt(
            movieDetail.BoxOffice.replace(/\$/g, "").replace(/,/g, ""),
        );
    } else {
        dollars = 0;
    }

    // converting data from the api to numbers for comparsion
    const metascore = parseInt(movieDetail.Metascore);
    const imdbRating = parseFloat(movieDetail.imdbRating);
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ""));

    // taking the awards and take only numbers that within the string and sum them
    const awards = movieDetail.Awards.split(" ").reduce((prev, word) => {
        const value = parseInt(word);
        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}"/>
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article  data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
