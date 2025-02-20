const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded!");

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
  }
});
