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
        console.log('Registration form submitted:', data);

        const response = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include', // Include credentials (sessions)
        });

        // Log the raw response
        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);

        // Attempt to parse the response as JSON
        let result;
        try {
          result = JSON.parse(rawResponse);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          throw new Error('Invalid server response');
        }

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
  }

  // Handle login form submission
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        console.log('Login form submitted:', data);

        const response = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
          credentials: 'include', // Include credentials (sessions)
        });

        // Log the raw response
        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse);

        // Attempt to parse the response as JSON
        let result;
        try {
          result = JSON.parse(rawResponse);
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          throw new Error('Invalid server response');
        }

        if (response.ok) {
          alert(result.message); // Show a success message
          console.log('Login successful. Redirecting to:', result.redirectUrl);
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

  // Check authentication status when loading /home
  if (window.location.pathname === '/home') {
    fetch(`${backendUrl}/home`, {
      credentials: 'include', // Include credentials (sessions)
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
