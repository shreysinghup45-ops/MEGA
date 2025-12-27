let products = [];
let cart = [];

// Load products from products.json
fetch('products.json')
    .then(res => res.json())
    .then(data => {
        products = data;
        displayProducts(products, 'featured-products');
        displayProducts(products, 'product-list');
    });

// Display products in given container
function displayProducts(productArray, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    productArray.forEach((product, index) => {
        const div = document.createElement('div');
        div.className = 'product-card';
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">₹${product.price}</p>
            <button onclick="addToCart(${index})">Add to Cart</button>
        `;
        container.appendChild(div);
    });
}

// Filter by category
function filterCategory(category) {
    if (category === 'All') {
        displayProducts(products, 'product-list');
    } else {
        const filtered = products.filter(p => p.category === category);
        displayProducts(filtered, 'product-list');
    }
}

// Search products
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(query));
        displayProducts(filtered, 'product-list');
    });
}

// Cart functions
function addToCart(index) {
    cart.push(products[index]);
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const totalPriceElem = document.getElementById('total-price');
    if (!cartItems || !totalPriceElem) return;

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
            </div>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartItems.appendChild(div);
        total += item.price;
    });

    totalPriceElem.textContent = total;

    // Update hidden fields for Formspree
    const orderData = document.getElementById('orderData');
    if (orderData) orderData.value = JSON.stringify(cart);

    const nameInput = document.getElementById('nameInput');
    const emailInput = document.getElementById('emailInput');
    const customerName = document.getElementById('customerName');
    const customerEmail = document.getElementById('customerEmail');
    if (nameInput && emailInput && customerName && customerEmail) {
        customerName.value = nameInput.value;
        customerEmail.value = emailInput.value;
    }
}
