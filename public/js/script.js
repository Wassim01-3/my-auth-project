const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded!');

  // Handle registration form submission
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        console.log('Registration form submitted:', data);

        const response = await fetch(`${backendUrl}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
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
  }

  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      try {
        console.log('Login form submitted:', data);

        const response = await fetch(`${backendUrl}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Login successful. Redirecting to:', result.redirectUrl);
          localStorage.setItem('token', result.token); // Store the token
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
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login.html'; // Redirect to login if no token
    } else {
      fetchUserData(); // Fetch user data if token exists
    }
  }
});

// Fetch user data from the backend
async function fetchUserData() {
  try {
    console.log('Fetching user data...');
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
      console.error('No token found');
      window.location.href = '/login.html'; // Redirect to login if no token
      return;
    }

    const response = await fetch(`${backendUrl}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the header
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log('User data fetched:', user);

      // Update the dropdown button with the user's data
      document.getElementById('username').textContent = user.username;
      document.getElementById('user-email').textContent = user.email;
    } else {
      console.error('Failed to fetch user data:', response.status, response.statusText);
      window.location.href = '/login.html'; // Redirect to login if unauthorized
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    window.location.href = '/login.html'; // Redirect to login on error
  }
}
