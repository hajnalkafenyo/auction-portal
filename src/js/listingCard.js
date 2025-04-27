async function fetchListings() {
    const body = await getListings()
    displayListings(body.data, true)
}

async function displayListings(listings, shouldShowViewLink) {
    let s = "";
    for (let i = 0; i < listings.length; i++) {
        const element = listings[i];
        const listingCardData = listingCard(element, shouldShowViewLink);
        s += listingCardData
    }

    document.getElementById('listing-container').innerHTML = s;
    document.getElementById('listing-container').style.display = 'grid';
}

async function listBid() {
    const body = await bidOnListing(listingId)
}

/**
 * 
 * @param {*} listingData This is a listing object
 * @param {*} maxBid 
 * @returns 
 */
function listingCard(listingData, shouldShowViewLink) {
    const date = dateDifference(listingData.created);
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr);
    const maxBid = getMaxBid(listingData.bids);
    const isUserPostAuthor = listingData.seller?.name === user?.name;
    const isAnyBid = listingData._count.bids > 0;

    var bidText = "";
    if (listingData._count.bids === 0) {
        bidText = "No bids yet"
    } else if (listingData._count.bids === 1) {
        bidText = "1 bid"
    } else {
        bidText = listingData._count.bids + " total bids"
    }
    return `
         <div class="col-span-12 sm:col-span-12 md:col-span-6 lg:col-span-4 border rounded border-gray-200 bg-white shadow-sm m-1">
            <div class="flex flex-row relative">
                <img src="${listingData.media[0]?.url}" alt="${listingData.media?.alt || ""}" onerror="this.src='/images/missing-image.png'" class="object-cover h-[300px] w-full">
                <div class="absolute top-4 right-8 rounded h-fit">${generateBadge(listingData)}</div>

            </div>
                <div class="p-4">
                    <p id="listingTitle" class="font-bold text-primary text-lg overflow-hidden overflow-ellipsis"><a href="listing.html?id=${listingData.id}">${listingData.title}</a></p>
                        <div class="flex flex-row justify-between">
                            <div>
                                <a href="profile.html?id=${listingData.seller?.name}">
                                <div class="flex flex-row items-center justify-center gap-1">
                                    <div><img src="${listingData.seller?.avatar.url}" alt="${listingData.seller?.avatar.alt}" class="w-4 h-4 rounded-full" /></div>
                                    <div>${listingData.seller?.name}</div>
                                </div>
                                </a>
                            </div>
                            <p>Created:${date}</p>
                            </div>
                            <hr />
                                <div id="listingBody">
                                    <p class="text-sm my-3 overflow-hidden overflow-ellipsis">${listingData.description || "<span class=\"italic\">No description provided</span>"}</p>
                                </div>
                            <hr />
                                <div class="flex flex-row justify-between items-center">
                                    <div>
                                        <p class="text-sm mt-3">Current Bid</p>
                                        <p class="font-bold text-primary">💰${maxBid}</p>
                                        <p class="text-sm text-gray-400">${bidText}</p>
                                    </div>
                                    
                                    <a href="listing.html?id=${listingData.id}" type="button" class="${isUserPostAuthor ? "hidden" : ""} bg-secondary p-2 pt-2 rounded-lg text-primary font-medium">Place Bid</a>
                            </div>
                        </div>
                    </div>
    `
}