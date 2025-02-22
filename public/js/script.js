const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Show success message
        window.location.href = result.redirectUrl; // Redirect to home page
      } else {
        alert('Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('An error occurred. Please try again.');
    }
  });
}

// Fetch user data on the home page
if (window.location.pathname === '/home') {
  fetch(`${backendUrl}/api/auth/user`, {
    credentials: 'include', // Include cookies
  })
    .then(response => {
      if (!response.ok) {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
      }
      return response.json();
    })
    .then(user => {
      // Update the UI with the user's data
      document.getElementById('username').textContent = user.username;
      document.getElementById('user-email').textContent = user.email;
    })
    .catch(err => {
      console.error('Error fetching user data:', err);
      window.location.href = '/login.html';
    });
}

// Handle logout
const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior

    try {
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        window.location.href = '/login.html'; // Redirect to login page
      } else {
        console.error('Logout failed:', response.status);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  });
}
