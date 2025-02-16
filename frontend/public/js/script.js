const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded!");

    // Handle registration form submission only if it exists
    const registrationForm = document.getElementById("registrationForm");
    if (registrationForm) {
        console.log("Registration form found!");

        registrationForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${backendUrl}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include', // Include cookies
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message); // Show a success message
                    window.location.href = result.redirectUrl; // Redirect to the login page
                } else {
                    alert(result.message || 'Registration failed');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.log("No registration form found, skipping registration handler.");
    }

    // Handle login form submission only if it exists
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        console.log("Login form found!");

        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(`${backendUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                    credentials: 'include', // Include cookies
                });

                const result = await response.json();
                if (response.ok) {
                    alert(result.message); // Show a success message
                    window.location.href = result.redirectUrl; // Redirect to the home page
                } else {
                    alert(result.message || 'Login failed');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.log("No login form found, skipping login handler.");
    }

    // Check authentication status when loading /home
    if (window.location.pathname === '/home') {
        fetch(`${backendUrl}/home`, {
            credentials: 'include', // Include cookies
        })
        .then(response => {
            if (!response.ok) {
                // If the user is not authenticated, redirect to the login page
                window.location.href = '/login.html';
            }
        })
        .catch(err => {
            console.error('Fetch error:', err);
            window.location.href = '/login.html';
        });
    }
});
