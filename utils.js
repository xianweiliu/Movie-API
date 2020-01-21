// delays the send request
const delayFetch = (func, delay = 1000) => {
    let timeOutId;
    // uses rest method that built-in javascript
    // takes all args stored into args
    return (...args) => {
        if (timeOutId) clearTimeout(timeOutId);
        timeOutId = setTimeout(() => {
            // .apply keep tracks of how many args that pass through
            func.apply(null, args);
        }, delay);
    };
};
