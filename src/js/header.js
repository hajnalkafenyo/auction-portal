function getUserFromLocalStorage() {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr)
    return user;
}

let currentCredits = 0;

async function getHeader() {
    const userFromLocalStorage = getUserFromLocalStorage()
    if (!userFromLocalStorage) {
        return;
    }
    const userName = userFromLocalStorage.name;
    const profile = await getProfile(userName);
    currentCredits = profile.credits;
    const headerElement = document.getElementById('header');
    headerHtml = headerContent(profile);
    headerElement.innerHTML = headerHtml;
    const logOut = document.getElementById("logOut");
    logOut.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("user");
        window.location.href = "login.html";
    })

}

function headerContent(user) {


    return `
    <nav id="header" class="flex flex-row w-full justify-center p-2 bg-white border">
        <div class="flex flex-row justify-between max-w-[1024px] w-full items-center">
            <a href="/" class="flex flex-row gap-8 h-fit">
                <img src="/images/logo.png" alt="BookBid Logo" style="height: 24px; width: 24px">
                <span class="font-bold text-primary sm:block hidden">BookBid</span>
            </a>
            <div class="flex flex-row gap-4 items-center">
                <a href="new_listing.html" type="button" class="button-primary px-2 hidden md:block">New Listing</a>
                <a href="new_listing.html" type="button" class="button-primary px-2 block md:hidden">+</a>
                <div class="bg-secondary p-2 pt-2 rounded-lg text-primary font-medium">💰${user.credits}</div>
                <a href="profile.html?id=${user.name}" id="headerUser" class="font-medium text-primary items-center">${user.name}</a>
                <a class="text-primary" id="logOut" href="#"><img src="/images/logout.svg" alt="logout icon" style="height: 24px; width: 24px"></a>
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
