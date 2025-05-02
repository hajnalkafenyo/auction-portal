function sortedListings(listings) {
    const sortedlistings = listings.sort((a, b) => (new Date(a.endsAt) - new Date(b.endsAt)));
    return sortedlistings;
}

async function fetchListings() {
    showLoading()
    const body = await getListings();
    const newList = sortedListings(body.data);
    displayListings(newList, true)
    hideLoading()
}

let timeoutHandle;
let running;

/**
 * Executes fn after a specific delay in ms, or if called again, skip the previous call
 * @param {Function} fn - An async function to execute
 * @param {number} delay - Delay in milliseconds
 */
async function debounce(fn, delay) {

    if (timeoutHandle) {
        clearTimeout(timeoutHandle)
    }

    await running;

    timeoutHandle = setTimeout(async () => {
        running = new Promise(async (res) => {
            timeoutHandle = undefined;
            await fn();
            res();
        });
        await running;
    }, delay)
}

document.getElementById("search-input").addEventListener("input", async (e) => {
    const searchTerm = e.target.value;
    debounce(async () => {
        const body = await search(searchTerm);
        displayListings(body.data, true);
    }, 1000)
})

const hideLoading = () => {
    const loading = document.getElementsByClassName('loading')[0];
    document.getElementById('listing-container').style.display = "grid";
    loading.style.display = 'none';
};
const showLoading = () => {
    const loading = document.getElementsByClassName('loading')[0];
    document.getElementById('listing-container').style.display = "none"
    loading.style.display = 'block';
};

const element = document.getElementById("active-toggle")
element.addEventListener("change", (e) => {
    searchOnlyActive = e.target.checked;
    fetchListings()
})

fetchListings()

