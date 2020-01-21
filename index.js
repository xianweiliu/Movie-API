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
