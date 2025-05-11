function getUserFromLocalStorage() {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr)
    return user;
}

const noUserHtml = `<nav id="header" class="flex flex-row w-full justify-center p-2 bg-white border">
        <div class="flex flex-row justify-between max-w-[1024px] w-full items-center">
            <a href="/" class="flex flex-row gap-8 h-fit">
                <img src="/images/logo.png" alt="BookBid Logo" style="height: 24px; width: 24px">
                <span class="font-bold text-primary sm:block hidden">BookBid</span>
            </a>
            <div class="flex flex-row gap-4 items-center">
                <a href="login.html" type="button" class="button-primary px-2 hidden md:block">Log In</a>
            </div>
        </div>
    </nav>`

let currentCredits = 0;

async function getHeader() {
    const headerElement = document.getElementById('header');
    const userFromLocalStorage = getUserFromLocalStorage()
    if (!userFromLocalStorage) {
        headerElement.innerHTML = noUserHtml;
        return;
    } else {
        const userName = userFromLocalStorage.name;
        const profile = await getProfile(userName);
        currentCredits = profile.credits;
        headerHtml = headerContent(profile);
        headerElement.innerHTML = headerHtml;
        const logOut = document.getElementById("logOut");
        logOut.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem("user");
            window.location.href = "login.html";
        })
    }

}

function headerContent(user) {


    return `
    <nav id="header" class="flex flex-row w-full justify-center p-2 bg-white border">
        <div class="flex flex-row justify-between max-w-[1024px] w-full items-center">
            <a data-toggle="popover" title="Home" href="/" class="flex flex-row gap-8 h-fit">
                <img src="/images/logo.png" alt="BookBid Logo" style="height: 24px; width: 24px">
                <span class="font-bold text-primary sm:block hidden">BookBid</span>
            </a>
            <div class="flex flex-row gap-4 items-center">
                <a data-toggle="popover" title="Create a new listing" href="new_listing.html" type="button" class="button-primary px-2 hidden md:block">New Listing</a>
                <a data-toggle="popover" title="Create a new listing" href="new_listing.html" type="button" class="button-primary px-2 block md:hidden">+</a>
                <div data-toggle="popover" title="Your Credits" class="bg-secondary p-2 pt-2 rounded-lg text-primary font-medium">💰${user.credits}</div>
                <a data-toggle="popover" title="Your user" href="profile.html?id=${user.name}" id="headerUser" class="font-medium text-primary items-center">${user.name}</a>
                <a data-toggle="popover" title="Log out" class="text-primary" id="logOut" href="#"><img src="/images/logout.svg" alt="logout icon" style="height: 24px; width: 24px"></a>
            </div>
        </div>
    </nav>
    `
}

document.addEventListener("readystatechange", (e) => {
    if (document.readyState === "complete") {
        getHeader().then(() => console.log('done'))

    }
})
