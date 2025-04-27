async function fetchProfileListings() {
    const profileName = getUserName()
    const body = await getProfilesListings(profileName)
    displayListings(body.data, true)
}
fetchProfileListings()