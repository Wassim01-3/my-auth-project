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
          window.location.href = result.redirectUrl;
        } else {
          if (result.message === 'User already exists') {
            showError('email', 'Email address already exists');
          } else if (result.message === 'Invalid username') {
            showError('username', 'Username is not supported');
          } else {
            showError('general', result.message || 'Registration failed');
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        showError('general', 'An error occurred. Please try again.');
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
          localStorage.setItem('token', result.token);
          window.location.href = result.redirectUrl;
        } else {
          if (result.message === 'Invalid email') {
            showError('email', 'Invalid email address');
          } else if (result.message === 'Invalid password') {
            showError('password', 'Invalid password');
          } else {
            showError('general', result.message || 'Login failed');
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        showError('general', 'An error occurred. Please try again.');
      }
    });
  }

  // Check authentication status when loading /home or /sell
  if (window.location.pathname === '/home' || window.location.pathname === '/sell') {
    fetchUserData();
    
    if (window.location.pathname === '/sell') {
      fetchUserProducts();
      setupProductForm();
    }
  }

  // Setup logout functionality
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('token');
      window.location.href = '/login.html';
    });
  }
});

// Fetch user data from the backend
async function fetchUserData() {
  try {
    console.log('Fetching user data...');
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found. User is not logged in.');
      if (window.location.pathname === '/sell' || window.location.pathname === '/home') {
        window.location.href = '/login.html';
      }
      return;
    }

    const response = await fetch(`${backendUrl}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const user = await response.json();
      console.log('User data fetched:', user);

      // Update the dropdown button with the user's data
      const usernameElement = document.getElementById('username');
      const userEmailElement = document.getElementById('user-email');
      
      if (usernameElement) usernameElement.textContent = user.username;
      if (userEmailElement) userEmailElement.innerHTML = `<i class="fas fa-envelope"></i><span>${user.email}</span>`;
    } else {
      console.error('Failed to fetch user data:', response.status, response.statusText);
      if (window.location.pathname === '/sell' || window.location.pathname === '/home') {
        window.location.href = '/login.html';
      }
    }
  } catch (err) {
    console.error('Error fetching user data:', err);
    if (window.location.pathname === '/sell' || window.location.pathname === '/home') {
      window.location.href = '/login.html';
    }
  }
}

// Setup product form functionality
function setupProductForm() {
  // Update the product form submission handler
  const productForm = document.getElementById('product-form');
  if (productForm) {
      productForm.addEventListener('submit', async (e) => {
          e.preventDefault();
          const token = localStorage.getItem('token');
          if (!token) {
              alert('Please login first');
              return window.location.href = '/login.html';
          }

          try {
              const formData = new FormData(productForm);
              const response = await fetch(`${backendUrl}/api/products`, {
                  method: 'POST',
                  headers: {
                      'Authorization': `Bearer ${token}`
                  },
                  body: formData
              });

              if (!response.ok) {
                  const error = await response.json();
                  throw new Error(error.message || 'Upload failed');
              }

                const result = await response.json();
              alert('Product added successfully!');
              productForm.reset();
              document.getElementById('image-preview').innerHTML = '';
              fetchUserProducts();
          } catch (err) {
              console.error('Product submission error:', err);
              alert(`Error: ${err.message || 'Failed to add product'}`);
          }
      });
  }

  // Image preview handling
  const imagesInput = document.getElementById('images');
  if (imagesInput) {
    imagesInput.addEventListener('change', function(e) {
      const preview = document.getElementById('image-preview');
      preview.innerHTML = '';
      
      Array.from(e.target.files).forEach(file => {
        if (file.size > 3 * 1024 * 1024) {
          alert(`File ${file.name} exceeds 3MB limit`);
          return;
        }
        
        if (!file.type.startsWith('image/')) {
          alert(`File ${file.name} is not an image`);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = function(event) {
          const previewItem = document.createElement('div');
          previewItem.className = 'image-preview-item';
          previewItem.innerHTML = `
            <img src="${event.target.result}" alt="Preview">
            <button class="remove-btn" onclick="removeImagePreview(this)">×</button>
          `;
          preview.appendChild(previewItem);
        };
        reader.readAsDataURL(file);
      });
    });
  }

  // Form submission handling
  productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${backendUrl}/api/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        alert('Product added successfully!');
        form.reset();
        document.getElementById('image-preview').innerHTML = '';
        fetchUserProducts();
      } else {
        alert(result.message || 'Failed to add product');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('An error occurred. Please try again.');
    }
  });
}

// Fetch user's products
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

// Render products with proper image handling
function renderProducts(products) {
  const container = document.getElementById('products-container');
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `
      <div class="no-products">
        <i class="fas fa-box-open" style="font-size: 48px; margin-bottom: 20px;"></i>
        <p>You haven't listed any products yet.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = products.map(product => {
    // Use first image or placeholder
    const mainImage = product.images && product.images.length > 0 ? 
      product.images[0] : 
      'https://via.placeholder.com/400x300?text=No+Product+Image';
    
    return `
      <div class="product-card" data-id="${product._id}">
        <div class="product-images">
          <img src="${mainImage}" 
               alt="${product.name}"
               onerror="this.onerror=null; this.src='https://via.placeholder.com/400x300?text=Image+Load+Failed'">
        </div>
        <div class="product-details">
          <h3>${product.name}</h3>
          <p><strong>Category:</strong> ${product.category}</p>
          <p><strong>Price:</strong> ${product.price} TND</p>
          <p><strong>Contact:</strong> ${product.phoneNumber}</p>
          <p><strong>Location:</strong> ${product.address}</p>
          <p>${product.description}</p>
          <div class="product-actions">
            <button class="btn-edit" onclick="editProduct('${product._id}')">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button class="btn-delete" onclick="deleteProduct('${product._id}')">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}
// Remove image preview
window.removeImagePreview = function(button) {
  button.parentElement.remove();
};

// Edit product
window.editProduct = function(productId) {
  console.log('Edit product:', productId);
  // Implement edit functionality
  alert('Edit functionality will be implemented here');
};

// Delete product
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

// Function to display error messages
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
