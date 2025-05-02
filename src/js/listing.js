async function fetchListing() {
    const urlParams = new URLSearchParams(window.location.search);
    const listingid = urlParams.get('id');
    const body = await getListing(listingid);
    const maxBid = getMaxBid(body.data.bids);
    const listingContentElement = document.getElementById('listingContent');
    listinghtml = listingContent(body.data);
    const breadcrumbElement = document.getElementById('breadcrumb');
    breadcrumbHtml = getBreadcrumb(body.data);
    document.title = `BookBid | ${body.data.title}`
    listingContentElement.innerHTML = listinghtml;
    breadcrumbElement.innerHTML = breadcrumbHtml;

    document.getElementById("share-button").addEventListener("click", () => {
        const postTitle = body.data.title
        const postFile = body.data.media?.[0]?.url || "";
        const postUrl = window.location.href;
        const seller = body.data.seller.name;
        const postBody = `Check out this listing from ${seller} on this link: ${postUrl}`;

        const postData = {
            postTitle,
            postBody,
            postFile
        }

        const postDataEncoded = btoa(JSON.stringify(postData))

        const url = `https://hajnalka-social-noroff.netlify.app/feed/index.html?data=${postDataEncoded}`

        window.open(url);
    });

    const setBidError = (message) => {
        const bidErrorElement = document.getElementById('bidError');
        const bidInputElement = document.getElementById('bidValue');
        bidInputElement.invalid = true;
        bidErrorElement.innerHTML = message;
        bidErrorElement.classList.remove("hidden");
    }

    const clearBidError = () => {
        const bidErrorElement = document.getElementById('bidError');
        const bidInputElement = document.getElementById('bidValue');
        bidInputElement.invalid = false;
        bidErrorElement.innerHTML = "";
        bidErrorElement.classList.add("hidden");
    }

    document.getElementById('bidButton').addEventListener("click", async (e) => {
        const bidValue = parseInt(document.getElementById('bidValue').value);
        if (bidValue > maxBid) {
            await bidOnListing(listingid, bidValue);
            location.reload();
        } else {
            setBidError("Bid is too low.")
            return false;
        }
    })

    document.getElementById('bidValue').addEventListener("change", (e) => {
        const bidValue = parseInt(e.target.value);
        if (bidValue < maxBid) {
            setBidError(`Bid must be higher than ${maxBid}`);
            return false;
        }

        if (currentCredits > 0 && bidValue > currentCredits) {
            setBidError(`You don't have enough credits`);
            return false;
        }
        clearBidError();
    })

}

function getBreadcrumb(body) {

    return `
    </nav>
    <div class="container max-w-[1024px] mx-auto w-full">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb flex flex-row mb-2">
                <li class="breadcrumb-item"><a href="/">Home</a>>></li>
                <li class="breadcrumb-item"><a href="index.html">listings</a>>></li>
                <li class="breadcrumb-item active font-medium" aria-current="page"><a href="/">${body.title}</a></li>
            </ol>
        </nav>`
}

function displayTags(tags) {
    let s = "";
    tags = tags.filter(t => !!t)
    for (let i = 0; i < tags.length; i++) {
        const element = tags[i];
        const tagElement = `<li class="bg-secondary text-primary rounded-full p-2">${element}</li>`
        s += tagElement
    }
    return s;
}
function tableRowContent(bids, isMax, isEnded) {
    const date = dateDifference(bids.created);
    let tableRowContentElement = ""
    if (isMax) {
        if (isEnded) {
            tableRowContentElement = `<td><div class="px-2 py-1 w-fit rounded-full bg-yellow-100 text-yellow-800">Winner</div></td>`
        } else {
            tableRowContentElement = `<td class="bg-green-100"><div class="px-2 py-1 w-fit rounded-full bg-green-200 text-green-800">Current High Bid</div></td>`
        }
    } else {
        tableRowContentElement = `<td><div class="px-2 py-1 w-fit rounded-full bg-gray-100 text-gray-800">OutBid</div></td>`
    }
    return `<tr class="border-b-2 grid gap-4 grid-cols-2 py-2 md:table-row">
                <td class="${isMax ? "" : "hidden"}bg-green-100"><a class="flex flex-row gap-2" href="profile.html?id=${bids.bidder.name}"><img src="${bids.bidder.avatar.url}" alt="${bids.bidder.avatar.alt}" class="w-8 h-8 rounded-full"><span class="inline">${bids.bidder.name}</span></a></td>
                <td class="${isMax ? "" : "hidden"}bg-green-100">💰${bids.amount}</td>
                <td class="${isMax ? "" : "hidden"}bg-green-100">${date}</td>
                ${tableRowContentElement}
            </tr> `

}
function tableContent(bids, isEnded) {
    let s = "";
    for (let i = 0; i < bids.length; i++) {
        const element = bids[i];
        const tableElement = tableRowContent(element, i === 0, isEnded);
        s += tableElement
    }
    return s;
}



function listingContent(body) {
    let endsAtString = "";
    const isEnded = new Date(body.endsAt) < new Date();
    if (!isEnded) {
        const date = dateDifferenceFuture(body.endsAt);
        endsAtString = `Auction ends ${date} `
    } else {
        const date = dateDifference(body.endsAt);
        endsAtString = `Auction ended ${date} `
    }

    var bidText = "";
    if (body._count.bids === 0) {
        bidText = "No bids yet"
    } else if (body._count.bids === 1) {
        bidText = "1 bid"
    } else {
        bidText = body._count.bids + " total bids"
    }


    const tags = displayTags(body.tags)
    const sortedBid = getSortedBid(body.bids);
    const maxBid = getMaxBid(body.bids);
    const tableContentElement = tableContent(sortedBid, isEnded);
    const isBidActive = new Date(body.endsAt) > new Date();
    const userName = body.seller?.name;
    const isUserListingAuthor = userName === getUserFromLocalStorage().name;



    return `
        <div class="grid grid-cols-12 w-full gap-4 p-1 md:p-4">
                <div class="flex flex-col gap-2 col-span-12 md:col-span-7">
                    <div class="relative">
                        <img src="${body.media[0]?.url || "/images/missing-image.png"}" alt="${body.media[0]?.alt || "Picture not found"}" class="border-[16px] border-solid border-white  w-full max-h-screen">
                        <div class="absolute top-4 left-8 rounded h-fit py-1 px-2">${generateBadge(body)}
                             </div>
                    </div>
                    <div class="flex flex-row gap-2 justify-between">
                        <img src="${body.media[1]?.url || ""}" alt="${body.media[1]?.alt || ""}" class="max-w-24">
                        <img src="${body.media[2]?.url || ""}" alt="${body.media[2]?.alt || ""}" class="max-w-24">
                        <img src="${body.media[3]?.url || ""}" alt="${body.media[3]?.alt || ""}" class="max-w-24">
                        <img src="${body.media[4]?.url || ""}" alt="${body.media[4]?.alt || ""}" class="max-w-24">
                    </div>
                </div>
                <div class="box flex flex-col p-4 gap-4 col-span-12 md:col-span-5">
                    <div class="header-1">
                        ${body.title}
                    </div>
                    <div>
                        <ul class="flex flex-row flex-wrap whitespace-nowrap gap-2">
                           ${tags}
                        </ul>
                    </div>
                    <div class="flex flex-row justify-between items-center content-between ">
                        <div class="border flex flex-col gap-8 rounded border-gray-200 bg-gray-100 shadow-sm p-2 w-full">
                            <div class="flex flex-row justify-between">
                                <div>
                                    <p id="BidContent">Current Bid</p>
                                    <p class="font-bold text-primary">💰${maxBid}</p>
                                    <p>${bidText}</p>
                                </div>
                                <div>
                                    <p>${endsAtString}</p>
                                </div>
                            </div>
                            <div class="${isBidActive && !isUserListingAuthor ? "" : "hidden"} flex flex-col items-center">
                                <div>
                                    <h2 class="text-primary font-medium">Your Bid (Higher than ${maxBid})</h2>
                                </div>
                                <div class=" flex flex-row p-2 group/inputfield">
                                    <input type="number" id="bidValue" min="${maxBid}" value="${maxBid + 1}" class="p-2 min-h-[72px] m-0 invalid:border-red-500 group-hover/inputfield:invalid:border-red-400 border-2 rounded-s-lg peer">
                                    <button dir="rtl"
                                        id="bidButton" class="button bg-primary peer-invalid:bg-red-500 group-hover/inputfield:peer-invalid:bg-red-400 group-hover/inputfield:bg-primary/90 rounded-s-lg py-2 font-bold text-white w-32 min-h-[72px] m-0">Place
                                        Bid</button>
                                </div>
                                <div id="bidError" class="hidden text-red-500 text-sm"></div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div class="flex flex-row gap-2 items-center">
                            <img class="w-8 h-8 rounded-full" src="${body.seller.avatar.url}" alt="${body.seller.avatar.alt}">
                            <div class="flex flex-col">
                                <p>Listed by: </p>
                                <a href="profile.html?id=${body.seller?.name}" class="font-medium text-primary">${body.seller?.name}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-end w-full">
                <button class="rounded-lg bg-white p-2 border border-black" id="share-button">Share</button>
            </div>
            <div class="box p-4 w-full">
                <h2 class="text-primary font-medium">About this listing</h2>
                <div>${body.description || "<span class=\"italic\">No description provided</span>"}</div>
            </div>
            <div class="box p-4 mb-4 w-full">
                <h1 class="header-1">Bid History</h1>
                <table class="w-full">
                    <thead class="font-thin hidden md:table-header-group">
                        <tr class="hidden md:table-row">
                            <th class="text-md text-gray-500 font-normal text-left">Bidder</th>
                            <th class="text-md text-gray-500 font-normal text-left">Amount</th>
                            <th class="text-md text-gray-500 font-normal text-left">Date & Time</th>
                            <th class="text-md text-gray-500 font-normal text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableContentElement}
                    </tbody>
                </table>
            </div>
            <div class="flex justify-center mb-4">
                <a href="index.html" type="button" class="bg-white border p-2 pt-2 rounded-lg text-primary m-2">View all Listings</a>
            </div>
    `
}

fetchListing();




