function getUserFromLocalStorage() {
    const userStr = localStorage.getItem("user");
    const user = JSON.parse(userStr)
    return user;
}

async function fetchProfile() {
    const userName = getUserName()
    const profile = await getProfile(userName);
    const profileContentElement = document.getElementById('profile-content');
    const profilehtml = profileContent(profile);
    profileContentElement.innerHTML = profilehtml;
    const profileBreadcrumb = document.getElementById('profileBread');
    const profileBreadhtml = getProfileBread(profile);
    document.title = `BookBid | ${profile.name}`;
    profileBreadcrumb.innerHTML = profileBreadhtml;
    const editProfileButtons = document.querySelectorAll(".edit-profile-button");
    const profileForm = document.querySelector(".edit-profile-form");
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const banner = e.target.querySelector(".edit-form-banner").value;
        const avatar = e.target.querySelector(".edit-form-avatar").value;
        const bio = e.target.querySelector(".edit-form-bio").value;
        const updatedData = {
            banner: {
                url: banner,
                alt: 'banner picture',
            },
            avatar: {
                url: avatar,
                alt: 'avatar picture',
            },
            bio: bio,
        }
        await updateProfile(userName, updatedData);
        window.location.reload();
    })

    editProfileButtons.forEach(editProfileButton => editProfileButton.addEventListener("click", (e) => {
        document.querySelector(".card-profile-form").classList.toggle("hidden");
    }));
}

function getProfileBread(user) {
    return `
    <nav id="profileBread" aria-label="breadcrumb">
            <ol class="breadcrumb flex flex-row mb-2">
                <li class="breadcrumb-item"><a href="/">Home</a>>></li>
                <li class="breadcrumb-item active font-medium" aria-current="page"><a href="profile.html">${user.name}</a>
                </li>
            </ol>
        </nav>`
}

function profileContent(user) {
    const userName = getUserName();
    const isUserListingAuthor = userName === getUserFromLocalStorage().name;
    return `
   
            <div class="relative mb-8">
                <img src="${user.banner}" alt="${user.bannerAlt}" class="object-cover w-full h-72">
                <div class="absolute -bottom-10 left-4">
                    <img src="${user.avatar}" alt="${user.avatarAlt}" class="object-cover w-40 h-40 border-black rounded-full">
                </div>
            </div>
            <div class="grid grid-cols-12 md:m-16 m-1 gap-4">
                <div class="flex flex-col md:col-span-9 col-span-12 ">
                    <div class="p-4">
                        <p class="header-1">${user.name}</p>
                        <p>${user.email}</p>
                    </div>
                    <div class="border rounded border-gray-200 bg-white p-4 shadow-sm">
                        <div class="font-bold text-primary">Bio</div>
                        <div class="text-primary italic">${user.bio || "User is not updated bio field yet"}</div>
                    </div>
                </div>
                <div class="border rounded border-gray-200 p-4 bg-white shadow-sm md:col-span-3 col-span-12 h-fit">
                    <p class="font-bold text-primary">Account balance</p>
                    <p class="font-bold text-green-600">${user.credits} Credits</p>
                </div>
                <div class="m-1">
                <button type="button" class="${isUserListingAuthor ? "" : "hidden"} button-primary px-2 edit-profile-button">Edit</button>
                </div>
            </div>
            <div class="card-body card-profile-form hidden">
                <form class="edit-profile-form">
                    <div class="form-floating">
                        <div class="mb-4 inputfield">
                            <label for="banner" class="form-label">Banner</label>
                            <input value="${user.banner || ""}" class="form-control edit-form-banner"  type="url" placeholder="Leave a picture here" />
                        </div>
                        <div class="mb-4 inputfield">
                            <label for="avatar" class="form-label">Avatar</label>
                            <input value="${user.avatar || ""}" class="form-control edit-form-avatar"  type="url" placeholder="Leave a picture here" />
                        </div>
                        <div>
                            <label for="Bio" class="form-label">Bio</label>
                            <textarea class="form-control edit-form-bio" 
                            placeholder="Leave a comment here">${user.bio || ""}</textarea>
                        </div>
                        </div>
                            <button class="button-primary px-2" type="submit">Save</button>
                            <button class="bg-secondary p-2 pt-2 rounded-lg text-primary font-medium edit-profile-button" type="button">Cancel</button>
                        </div>
                    </div >
                </form>    
            </div>        
            <div class="flex flex-row justify-between">
                <p class="font-bold text-primary">My Listings</p>
            </div>
            <div class="grid grid-cols-12 w-fit gap-2 md:m-16 m-1" id="listing-container">
            </div>
            <div class="flex justify-center mb-4">
                <a href="index.html" type="button" class="bg-white border p-2 pt-2 rounded-lg text-primary m-2">View all Listings</a>
            </div>`
}

fetchProfile()