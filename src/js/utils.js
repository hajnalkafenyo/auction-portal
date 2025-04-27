function dateDifferenceFuture(value) {
    const currentTime = new Date();
    const futureTime = new Date(value);
    const timeDifference = futureTime - currentTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);

    if (weeks > 1) {
        return `in ${weeks} weeks`
    }
    if (days > 1) {
        return `in ${days} days`
    }
    if (hours > 1) {
        return `in ${hours} hours`
    }
    if (minutes > 1) {
        return `in ${minutes} minutes`
    }
    if (minutes === 1) {
        return `in 1 minute`
    }

    return "now"
}

function dateDifference(value) {
    const currentTime = new Date();
    const pastTime = new Date(value);
    const timeDifference = currentTime - pastTime;
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    if (minutes < 1) {
        return "just now";
    } else if (minutes === 1) {
        return "1 minute ago";
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours === 1) {
        return "1 hour ago";
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else if (days === 1) {
        return "1 day ago";
    } else if (days < 7) {
        return `${days} days ago`;
    } else if (weeks === 1) {
        return "1 week ago";
    } else {
        return `${weeks} weeks ago`;
    }
}

function newListingTreshold() {
    const d = new Date()
    d.setTime(d.getTime() - (1 * 60 * 60 * 1000));
    return d;
}

function getStatus(listing) {
    if (newListingTreshold() < new Date(listing.created)) {
        return "new";
    }

    if (new Date() > new Date(listing.endsAt)) {
        if (listing.bids.length > 0) {
            return "sold";
        }
        return "closed"
    }

    return "active";
}
function isCurrentUser(userName) {
    //isUserName is in the localStorage

}

function getSortedBid(bids) {
    const sortedBid = bids.sort((a, b) => (b.amount - a.amount));
    return sortedBid;
}

function getMaxBid(bids) {
    if (bids.length === 0) {
        return 0;
    }
    let max = 0
    for (let i = 1; i < bids.length; i++) {
        if (bids[i].amount > bids[max].amount) {
            max = i
        }
    }
    return bids[max].amount
}


function generateBadge(listing) {
    const status = getStatus(listing);
    const commonClasses = "rounded py-0.5 px-2 shadow-md border";
    switch (status) {
        case "new":
            return `<div class="text-yellow-700 border-yellow-500 bg-yellow-300 ${commonClasses}">New</div>`
        case "active":
            return `<div class="text-green-700 border-green-500 bg-green-300 ${commonClasses}">Active</div>`
        case "closed":
            return `<div class="text-gray-700 border-gray-500 bg-gray-300 ${commonClasses}">Closed</div>`
        case "sold":
            return `<div class="text-gray-700 border-gray-500 bg-gray-300 ${commonClasses}">Sold</div>`
    }

}


function getUserName() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('id');
    if (myParam !== null) {
        return myParam;
    } else {
        return getUserFromLocalStorage().name;
    }
}