/*
    reuseable code for auto complete;
    since it needs to create two search bars for movie compare.

    also making sure it can be used for diffent type of api
*/

const createAutoComplete = ({
    root,
    renderOption,
    onOptionSelect,
    inputValue,
    fetchData,
}) => {
    // root is passed from the index.js therefore it would create different autocomplete
    root.innerHTML = `
    <label class="label"><b>Search: </b></label>
    <div class="dropdown">
        <input class="input is-primary searchBar"/>
        <div class="dropdown-menu">
            <div class="dropdown-content results">

            </div>
        </div>
    </div>
`;
    // look for these tags from the root element that was created above
    const searchBar = root.querySelector("input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results");

    // search bar
    const onSearchBar = async event => {
        if (!event.target.value) return;
        // await for data to be resolved
        const items = await fetchData(event.target.value);
        // check see if there's anythin in the movies
        if (!items.length) {
            // if not remove the class "is-active"
            dropdown.classList.remove("is-active");
            // then break it out of this function
            return;
        }

        resultsWrapper.innerHTML = "";
        dropdown.classList.add("is-active");
        for (let item of items) {
            const option = document.createElement("a");

            option.classList.add("dropdown-item");
            // create a function call, to process them, and render it
            // makes easier when have to change sometime.
            option.innerHTML = renderOption(item);
            // add event listener to each pieces of movie.
            option.addEventListener("click", () => {
                dropdown.classList.remove("is-active");
                searchBar.value = inputValue(item);
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };

    searchBar.addEventListener("input", delayFetch(onSearchBar, 1000));

    // added an event listener to the whole body,
    // except everything within the root tag
    document.addEventListener("click", event => {
        // if user clicked areas that is within root tag
        if (!root.contains(event.target)) {
            // remove class is-active
            dropdown.classList.remove("is-active");
        }
    });
};
