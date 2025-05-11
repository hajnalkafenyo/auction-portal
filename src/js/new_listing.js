const form = document.getElementById('listingArea');

const fileInputWrappers = document.querySelectorAll('.file-input-wrapper');
const fileInputs = document.querySelectorAll('input[type="url"]');

if (form !== null) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const listingTitle = document.getElementById('title').value;
        const listingBody = document.getElementById('description').value;
        const listingDate = document.getElementById('date').value;
        const listingTime = document.getElementById('time').value
        const tagsValue = document.getElementById("tags").value;
        const tags = tagsValue.split(",").map(e => e.trim())

        const t = `${listingDate}T${listingTime}:00.000+0200`
        const d = new Date(t);
        const endsAt = d.toISOString()

        const fileContents = [...fileInputs]
            .map(input => input.value)
            .filter(e => !!e)
            .map(e => ({
                url: e,
                alt: "User's image"
            }));


        const result = await postListing(listingTitle, listingBody, fileContents, endsAt, tags);
        const id = result.data.id;
        window.location.href = "listing.html?id=" + id;
    });
}

const fileInputChangeHandler = (e) => {
    const contents = [...fileInputs].map((input) => {
        return input.value
    }).filter((e) => !!e);

    for (let i = 0; i < 5; i++) {
        let content = "";
        if (contents.length > i) {
            content = contents[i]
        }
        document.getElementById(`listingFile${i}`).value = content
    }

    fileInputs.forEach((input) => {
        const id = parseInt(input.id.slice(-1));
        const hasContent = !!input.value
        if (id <= 3) {
            if (hasContent) {
                fileInputWrappers[id].classList.remove("hidden")
            } else {
                if (id < 4 && !fileInputs[id + 1].value) {
                    fileInputWrappers[id].classList.add("hidden")
                }
            }
        }

    });
};

fileInputs.forEach((input) => {
    input.addEventListener("keyup", fileInputChangeHandler)
})