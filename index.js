// created async/await functions to fech data by using axios
const fetchData = async searchTerm => {
    const res = await axios.get("http://www.omdbapi.com/", {
        // by creating this object it will auto appened these values to the url
        params: {
            apikey: "bff1ca7e",
            // for search purpose
            s: searchTerm,
        },
    });
    // dealing with api Errors -> that's from the api
    if (res.data.Error) {
        // return an empty array
        return [];
    }
    // return data
    return res.data.Search;
};

// create a HTML setup for inserting to HTML file
const root = document.querySelector(".autocomplete");
root.innerHTML = `
<label class="label"><b>Search Moive: </b></label>
<div class="dropdown">
    <input class="input is-primary searchBar"/>
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`;

// selected element from the body
const searchBar = document.querySelector("input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results");

// search bar
const onSearchBar = async event => {
    // check see if there's value in the input, if not do no send request
    if (!event.target.value) return;
    // await for data to be resolved than stored into movies variable
    const movies = await fetchData(event.target.value);
    // check see if there's anythin in the movies
    if (!movies.length) {
        // if not remove the class "is-active"
        dropdown.classList.remove("is-active");
        return;
    }

    resultsWrapper.innerHTML = "";
    // if there's fetch successed add class is-active
    dropdown.classList.add("is-active");
    // loop through the data
    for (let movie of movies) {
        // create element for each pieces data
        const option = document.createElement("a");
        // preventing broken image for no src defined
        const imgSrc = movie.Poster === "N/A" ? "" : movie.Poster;
        option.classList.add("dropdown-item");
        // inserting data to the element created above
        option.innerHTML = `
            <img src="${imgSrc}" />
            ${movie.Title}
        `;
        // added event listener to each movie option
        // when selected the search bar value set to movie actual title
        option.addEventListener("click", () => {
            dropdown.classList.remove("is-active");
            searchBar.value = movie.Title;
            // pass movie object to onMovieSelect fetch function
            onMovieSelect(movie);
        });
        // insert it into the result element
        resultsWrapper.appendChild(option);
    }
};
//                                  preventing send request every single time.
searchBar.addEventListener("input", delayFetch(onSearchBar, 1000));

// added an event listener to the whole body, except everything within the root tag

document.addEventListener("click", event => {
    // if user clicked areas that is within root tag
    if (!root.contains(event.target)) {
        // remove class is-active
        dropdown.classList.remove("is-active");
    }
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
