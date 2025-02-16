const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded!");

  // Handle registration form submission
  const registrationForm = document.getElementById("registrationForm");
  if (registrationForm) {
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
          alert(result.message);
          window.location.href = result.redirectUrl;
        } else {
          alert(result.message || 'Registration failed');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
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
          alert(result.message);
          window.location.href = result.redirectUrl;
        } else {
          alert(result.message || 'Login failed');
        }
      } catch (err) {
        console.error('Fetch error:', err);
        alert('An error occurred. Please try again.');
      }
    });
  }

  // Check authentication status when loading /home
  if (window.location.pathname === '/home') {
    fetch(`${backendUrl}/home`, {
      credentials: 'include', // Include cookies
    })
    .then(response => {
      if (!response.ok) {
        window.location.href = '/login.html';
      }
    })
    .catch(err => {
      console.error('Fetch error:', err);
      window.location.href = '/login.html';
    });
  }
});
