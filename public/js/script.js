const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

// Error handling functions
function showError(field, message) {
  const input = document.getElementById(field);
  const errorElement = document.getElementById(`${field}-error`);

  if (input && errorElement) {
    input.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  } else if (field === 'general') {
    alert(message);
  }
}

function clearErrors() {
  const errors = document.querySelectorAll('.error-message');
  const inputs = document.querySelectorAll('.input-field');

  errors.forEach(error => {
    error.textContent = '';
    error.style.display = 'none';
  });

  inputs.forEach(input => {
    input.classList.remove('error');
  });
}

// Login functionality
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      window.location.href = result.redirectUrl;
    } else {
      showError('general', result.message || 'Login failed');
    }
  } catch (err) {
    showError('general', 'An error occurred. Please try again.');
  }
});

// Registration functionality
document.getElementById('registrationForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
      window.location.href = result.redirectUrl;
    } else {
      showError('general', result.message || 'Registration failed');
    }
  } catch (err) {
    showError('general', 'An error occurred. Please try again.');
  }
});

// Load user data on page load
document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    updateUserUI(user);
  }
  
  if (isProtectedPage()) {
    verifyToken();
  }
});

// Update UI with user data
function updateUserUI(user) {
  const usernameElement = document.getElementById('username');
  const emailElement = document.getElementById('user-email');
  
  if (usernameElement) usernameElement.textContent = user.username;
  if (emailElement) {
    emailElement.innerHTML = `<i class="fas fa-envelope"></i><span>${user.email}</span>`;
  }
}

// Check if current page is protected
function isProtectedPage() {
  const protectedPaths = ['/home', '/sell', '/plastic-selling'];
  return protectedPaths.some(path => window.location.pathname.includes(path));
}

// Verify token validity
async function verifyToken() {
  const token = localStorage.getItem('token');
  if (!token) {
    redirectToLogin();
    return;
  }

  try {
    const response = await fetch(`${backendUrl}/api/auth/user`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) throw new Error('Invalid token');
    
    const user = await response.json();
    localStorage.setItem('user', JSON.stringify(user));
    updateUserUI(user);
  } catch (err) {
    console.error('Token verification failed:', err);
    redirectToLogin();
  }
}

// Redirect to login page
function redirectToLogin() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
}

// Logout functionality
document.getElementById('logout-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login.html';
});
