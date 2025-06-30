const productList = document.getElementById('product-list');
const cartModal = document.getElementById('cart-modal');
const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const categoriesDiv = document.getElementById('categories');

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
}

function fetchProducts() {
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      allProducts = data;
      displayProducts(data);
    });
}

function fetchCategories() {
  fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(categories => {
      const allBtn = document.createElement('button');
      allBtn.textContent = "All";
      allBtn.onclick = () => displayProducts(allProducts);
      categoriesDiv.appendChild(allBtn);

      categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat;
        btn.onclick = () => {
          const filtered = allProducts.filter(p => p.category === cat);
          displayProducts(filtered);
        };
        categoriesDiv.appendChild(btn);
      });
    });
}

function displayProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title.slice(0, 40)}...</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(card);
  });
}

function addToCart(id) {
  const product = allProducts.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ id: product.id, title: product.title, price: product.price, quantity: 1 });
  }
  saveCart();
}

function openCart() {
  cartItems.innerHTML = '';
  if (cart.length === 0) {
    cartItems.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.title} x ${item.quantity} - $${item.price * item.quantity}`;
      cartItems.appendChild(li);
    });
  }
  cartModal.style.display = 'block';
}

function closeCart() {
  cartModal.style.display = 'none';
}

document.querySelector('.cart-btn').addEventListener('click', openCart);
document.querySelector('.close-btn').addEventListener('click', closeCart);
window.onclick = e => { if (e.target == cartModal) closeCart(); };

fetchProducts();
fetchCategories();
updateCartCount();
