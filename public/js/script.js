const backendUrl = 'https://green-tunisia-h3ji.onrender.com';

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded!');

  // Handle registration form submission
  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

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
          console.log('Registration successful. Redirecting to:', result.redirectUrl);
          window.location.href = result.redirectUrl; // Redirect to the login page
        } else {
          // Handle errors
          if (result.message === 'User already exists') {
            showError('email', 'Email address already exists');
          } else if (result.message === 'Invalid username') {
            showError('username', 'Username is not supported');
          } else {
            showError('general', result.message || 'Registration failed'); // Fallback for other errors
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        showError('general', 'An error occurred. Please try again.'); // Fallback for network errors
      }
    });
  }

  // Handle login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Clear previous errors
      clearErrors();

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
          window.location.href = result.redirectUrl; // Redirect to the home page
        } else {
          // Handle errors
          if (result.message === 'Invalid email') {
            showError('email', 'Invalid email address');
          } else if (result.message === 'Invalid password') {
            showError('password', 'Invalid password');
          } else {
            showError('general', result.message || 'Login failed'); // Fallback for other errors
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        showError('general', 'An error occurred. Please try again.'); // Fallback for network errors
      }
    });
  }

  // Check authentication status when loading /home
  if (window.location.pathname === '/home') {
    fetchUserData();
  }
});

// Fetch user data from the backend
async function fetchUserData() {
  try {
    console.log('Fetching user data...');
    const token = localStorage.getItem('token'); // Get the token from localStorage

    if (!token) {
      console.log('No token found. User is not logged in.'); // Log a message
      return; // Stop further execution
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
      console.log('User is not authenticated.'); // Log a message
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    console.log('An error occurred while fetching user data.'); // Log a message
  }
}

// Logout functionality
const logoutLink = document.getElementById('logout-link');
if (logoutLink) {
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault(); // Prevent default link behavior

    try {
      console.log('Logging out...');
      const response = await fetch(`${backendUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        console.log('Logout successful');
        localStorage.removeItem('token'); // Remove the token
        window.location.href = '/login.html';
      } else {
        console.error('Logout failed:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  });
}

// Function to display error messages
function showError(field, message) {
  const input = document.getElementById(field);
  const errorElement = document.getElementById(`${field}-error`);

  if (input && errorElement) {
    input.classList.add('error'); // Add red border
    errorElement.textContent = message; // Set error message
    errorElement.style.display = 'block'; // Show error message
  } else if (field === 'general') {
    // Fallback for general errors (e.g., network errors)
    alert(message); // Use alert as a fallback
  }
}

// Function to clear all errors
function clearErrors() {
  const errors = document.querySelectorAll('.error-message');
  const inputs = document.querySelectorAll('.input-field');

  errors.forEach((error) => {
    error.textContent = '';
    error.style.display = 'none';
  });

  inputs.forEach((input) => {
    input.classList.remove('error');
  });
}
// Previous code remains the same until the end, then add:

// Product-related functions
async function fetchUserProducts() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await fetch(`${backendUrl}/api/products/my-products`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const products = await response.json();
      renderProducts(products);
    }
  } catch (err) {
    console.error('Error fetching products:', err);
  }
}

function renderProducts(products) {
  const container = document.getElementById('products-container');
  
  if (!container) return;

  if (products.length === 0) {
    container.innerHTML = '<div class="no-products"><p>You haven\'t listed any products yet.</p></div>';
    return;
  }

  container.innerHTML = products.map(product => `
    <div class="product-card" data-id="${product._id}">
      <div class="product-images">
        ${product.images.length > 0 ? 
          `<img src="${backendUrl}${product.images[0]}" alt="${product.name}">` : 
          '<div style="background: #eee; width: 200px; height: 150px;"></div>'}
      </div>
      <div class="product-details">
        <h3>${product.name}</h3>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> ${product.price} TND</p>
        <p><strong>Description:</strong> ${product.description}</p>
        <div class="product-actions">
          <button class="btn-edit" onclick="editProduct('${product._id}')">Edit</button>
          <button class="btn-delete" onclick="deleteProduct('${product._id}')">Delete</button>
        </div>
      </div>
    </div>
  `).join('');
}

// Initialize on sell page
if (window.location.pathname === '/sell') {
  fetchUserData();
  fetchUserProducts();
}

// Add to window object for HTML onclick handlers
window.editProduct = function(productId) {
  // Implement edit functionality
  console.log('Edit product:', productId);
};

window.deleteProduct = async function(productId) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${backendUrl}/api/products/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert('Product deleted successfully');
      fetchUserProducts();
    } else {
      const result = await response.json();
      alert(result.message || 'Failed to delete product');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('An error occurred. Please try again.');
  }
};
