const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded!');

  // Get the current page path
  const currentPath = window.location.pathname;

  // Handle registration form submission (only on the register page)
  if (currentPath === '/register.html') {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
      registrationForm.addEventListener('submit', async (e) => {
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
    }
  }

  // Handle login form submission (only on the login page)
  if (currentPath === '/login.html') {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
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
  }

  // Fetch user data on the home page
  if (currentPath === '/home.html') {
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
});
