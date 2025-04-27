function validateNoroffEmail(email) {
    const noroffEmailPattern = /^[a-zA-Z0-9._%+-]+@(stud\.)?noroff\.no$/;
    const emailError = document.getElementById('email-error');
    if (noroffEmailPattern.test(email) == false) {
        emailError.innerText = 'Invalid email. Please use @noroff.no or @stud.noroff.no.';
        return false;
    } else {
        emailError.innerText = '';
        return true;
    }
}

document.getElementById("form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const isEmailValid = validateNoroffEmail(email);
    if (!isEmailValid) {
        return false
    }
    const password = document.getElementById('password').value;
    const requestData = {
        "email": email,
        "password": password
    }
    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/login", {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "X-Noroff-API-Key": "72a1c703-80ba-45da-a12e-3fcc1efb2c64"
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const user = {
            name: data.data.name,
            email: data.data.email,
            accessToken: data.data.accessToken
        }
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "profile.html"
    } catch (error) {
        console.error('Error sending data:', error);
    }
});