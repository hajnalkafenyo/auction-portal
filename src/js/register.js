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

document.getElementById("emailform").addEventListener("submit", async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const isEmailValid = validateNoroffEmail(email);
    if (!isEmailValid) {
        return false
    }
    const password = document.getElementById('password').value;
    const repeatPassword = document.getElementById('repeat-password').value;
    const password2HelpText = document.getElementById('password2-help-text');

    if (password === repeatPassword) {
        password2HelpText.style.color = 'green';
        password2HelpText.textContent = 'Passwords match!';
    } else {
        password2HelpText.style.color = 'red';
        password2HelpText.textContent = 'Passwords do not match!';
        return false;
    }

    const name = document.getElementById('name').value;
    const nameError = document.getElementById('name-error');
    const namePattern = /^[a-zA-Z0-9_]{1,20}$/;
    if (namePattern.test(name) == false) {
        nameError.innerText = 'Invalid name. Please write maximum 20 characters.';
        return false;
    } else {
        nameError.innerText = '';
    }

    const requestData = {
        "email": email,
        "password": password,
        "repeatPassword": repeatPassword,
        "name": name,

    }
    try {
        const response = await fetch("https://v2.api.noroff.dev/auth/register", {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "X-Noroff-API-Key": "72a1c703-80ba-45da-a12e-3fcc1efb2c64"
            },
            body: JSON.stringify(requestData)
        });
        if (!response.ok) {
            const data = await response.json();
            document.getElementById("user-error").innerHTML = `Failed to register profile: ${data.errors.map((e) => e.message).join(", ")}`;
            return;
        }

        window.location.href = "login.html"
    } catch (error) {
        console.error('Error sending data:', error);
        // Show an error to the user
    }

});