const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
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
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    alert('Registration successful!');
                    window.location.href = '/login.html'; // Redirect to login page
                } else {
                    alert('Registration failed');
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
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });

                if (response.ok) {
                    const { token } = await response.json();
                    localStorage.setItem('token', token);
                    window.location.href = '/home';
                } else {
                    alert('Login failed');
                }
            } catch (err) {
                console.error('Fetch error:', err);
                alert('An error occurred. Please try again.');
            }
        });
    } else {
        console.log("No login form found, skipping login handler.");
    }
});
