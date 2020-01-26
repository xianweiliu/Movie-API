createAutoComplete({
    root: document.querySelector(".autocomplete"),
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
    onOptionSelect(movie) {
        // create another fetch call and passed the current selected movie
        onMovieSelect(movie);
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
});

// fetch data from the that particular movie with detailed info
const onMovieSelect = async movie => {
    const res = await axios.get("http://www.omdbapi.com/", {
        // by creating this object it will auto appened these values to the url
        params: {
            i: movie.imdbID,
            apikey: "bff1ca7e",
        },
    });
    // select the element that we wanted to add content, and pass the data to the template that created below
    document.querySelector("#summary").innerHTML = movieTemplate(res.data);
};

// created detailed template for the Movie that is selected
const movieTemplate = movieDetail => {
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
        <article class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">BoxOffice</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};
