const form = document.getElementById('listingArea');

if (form !== null) {
    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        const listingTitle = document.getElementById('title').value;
        const listingBody = document.getElementById('description').value;
        const listingFile = document.getElementById('listingFile').value;
        const listingDate = document.getElementById('date').value;
        const listingTime = document.getElementById('time').value

        const t = `${listingDate}T${listingTime}:00.000+0200`
        const d = new Date(t);
        const endsAt = d.toISOString()
        await postListing(listingTitle, listingBody, listingFile, endsAt);
        window.location.reload();
    });
}