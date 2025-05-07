let searchOnlyActive = true;

async function callApiWithoutAuth(url, method, body) {
    return callApi(url, method, {}, body);
}

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

async function updateProfile(userName, updatedData) {
    return callApiWithAuth(`/auction/profiles/${userName}`, "PUT", updatedData)
}

async function getProfilesListings(userName) {
    return callApiWithAuth(`/auction/profiles/${userName}/listings?_bids=true&_seller=true`, "GET")
}

async function getListings() {
    return callApiWithoutAuth(`/auction/listings?_bids=true&_seller=true&_active=${searchOnlyActive ? "true" : "false"}`, "GET")
}

/**
 * Creates a new bid on an existing lising
 * @param {*} listingId 
 * @returns 
 */
async function bidOnListing(listingId, amount) {
    const body = { amount }
    return callApiWithAuth(`/auction/listings/${listingId}/bids`, "POST", body)
}

async function getListing(listingId) {
    return callApiWithAuth(`/auction/listings/${listingId}?_seller=true&_bids=true`, "GET")
}

async function search(searchTerm) {
    return callApiWithoutAuth(`/auction/listings/search?q=${searchTerm}&_seller=true&_bids=true`, "GET")
}

async function deleteListing(listingId) {
    return callApiWithAuth(`/auction/listings/${listingId}`, "DELETE")
}

async function updateListing(listingId, updatedData) {
    return callApiWithAuth(`/auction/listings/${listingId}`, "PUT", updatedData)
}