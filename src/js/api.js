/**
 * Indicates whether only active listings should be searched.
 * @type {boolean}
 */
let searchOnlyActive = true;

/**
 * Calls the API without authentication.
 * @param {string} url - The endpoint URL.
 * @param {string} method - The HTTP method (e.g., GET, POST).
 * @param {Object} [body] - The request body.
 * @returns {Promise<any>} The API response.
 */
async function callApiWithoutAuth(url, method, body) {
    return callApi(url, method, {}, body);
}

/**
 * Calls the API with authentication.
 * Redirects to login if the user is not authenticated.
 * @param {string} url - The endpoint URL.
 * @param {string} method - The HTTP method (e.g., GET, POST).
 * @param {Object} [body] - The request body.
 * @returns {Promise<any>} The API response.
 */
async function callApiWithAuth(url, method, body = undefined) {
    const isThereUser = !!localStorage.getItem("user")
    if (!isThereUser) {
        window.location.href = "login.html"
        return
    }
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr)
    return callApi(url, method, {
        "Authorization": `Bearer ${user.accessToken}`
    }, body);

}

/**
 * Makes a generic API call.
 * @param {string} url - The endpoint URL.
 * @param {string} method - The HTTP method (e.g., GET, POST).
 * @param {Object} headers - The request headers.
 * @param {Object} [body] - The request body.
 * @returns {Promise<any>} The API response.
 * @throws {Error} If the response is not successful.
 */
async function callApi(url, method, headers = {}, body = undefined) {
    const baseUrl = "https://v2.api.noroff.dev";

    headers = {
        ...headers,
        "X-Noroff-API-Key": "72a1c703-80ba-45da-a12e-3fcc1efb2c64",
    };
    if (body) {
        headers['Content-Type'] = 'application/json'
    }
    const response = await fetch(baseUrl + url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body)
    });
    if (response.status === 204) { return }
    if (response.ok) {
        const result = await response.json();
        return result
    } else {
        throw new Error(`Error during ${method} request to ${url}: ${response.statusText}`);
    }
}

/**
 * Posts a new listing to the auction portal.
 * @param {string} title - The title of the listing.
 * @param {string} description - The description of the listing.
 * @param {Object[]} images - Array of image URLs and alts-
 * @param {string} endsAt - The end date and time of the listing.
 * @param {string[]} tags - Array of tags for the listing.
 * @returns {Promise<any>} The API response.
 */
async function postListing(title, description, images, endsAt, tags) {

    const listingData = {
        title: title,
        endsAt: endsAt,
        description: description,
        media: images,
        tags: tags
    }

    return callApiWithAuth("/auction/listings", "POST", listingData)
}

/**
 * Retrieves a user's profile by their ID.
 * @param {string} profileId - The ID of the profile.
 * @returns {Promise<Object>} The profile data.
 */
async function getProfile(profileId) {
    const data = await callApiWithAuth(`/auction/profiles/${profileId}`, "GET")

    const profile = {
        name: data.data.name,
        email: data.data.email,
        credits: data.data.credits,
        banner: data.data.banner.url,
        bannerAlt: data.data.banner.alt,
        avatar: data.data.avatar.url,
        avatarAlt: data.data.avatar.alt,
        bio: data.data.bio
    }
    return profile;
}

/**
 * Updates a user's profile.
 * @param {string} userName - The username of the profile.
 * @param {Object} updatedData - The updated profile data.
 * @returns {Promise<any>} The API response.
 */
async function updateProfile(userName, updatedData) {
    return callApiWithAuth(`/auction/profiles/${userName}`, "PUT", updatedData)
}

/**
 * Retrieves all listings for a specific user.
 * @param {string} userName - The username of the profile.
 * @returns {Promise<any>} The API response.
 */
async function getProfilesListings(userName) {
    return callApiWithAuth(`/auction/profiles/${userName}/listings?_bids=true&_seller=true`, "GET")
}

/**
 * Retrieves all auction listings.
 * @returns {Promise<any>} The API response.
 */
async function getListings() {
    return callApiWithoutAuth(`/auction/listings?_bids=true&_seller=true&_active=${searchOnlyActive ? "true" : "false"}`, "GET")
}

/**
 * Places a bid on a specific listing.
 * @param {string} listingId - The ID of the listing.
 * @param {number} amount - The bid amount.
 * @returns {Promise<any>} The API response.
 */
async function bidOnListing(listingId, amount) {
    const body = { amount }
    return callApiWithAuth(`/auction/listings/${listingId}/bids`, "POST", body)
}

/**
 * Retrieves a specific listing by ID.
 * @param {string} listingId - The ID of the listing.
 * @returns {Promise<any>} The API response.
 */
async function getListing(listingId) {
    return callApiWithAuth(`/auction/listings/${listingId}?_seller=true&_bids=true`, "GET")
}

/**
 * Searches for listings based on a search term.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<any>} The API response.
 */
async function search(searchTerm) {
    return callApiWithoutAuth(`/auction/listings/search?q=${searchTerm}&_seller=true&_bids=true`, "GET")
}

/**
 * Deletes a specific listing by ID.
 * @param {string} listingId - The ID of the listing.
 * @returns {Promise<any>} The API response.
 */
async function deleteListing(listingId) {
    return callApiWithAuth(`/auction/listings/${listingId}`, "DELETE")
}

/**
 * Updates a specific listing by ID.
 * @param {string} listingId - The ID of the listing.
 * @param {Object} updatedData - The updated listing data.
 * @returns {Promise<any>} The API response.
 */
async function updateListing(listingId, updatedData) {
    return callApiWithAuth(`/auction/listings/${listingId}`, "PUT", updatedData)
}