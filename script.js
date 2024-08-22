const bar = document.getElementById('bar');
const navbar = document.getElementById('navbar');
const close = document.getElementById("close");
const signButton = document.getElementById("sign-up");
const backButton = document.getElementById("back-to-top");
const images = document.querySelectorAll("#slider img");

window.onload = function() {
    const path = window.location.pathname;
    if (path.includes("index.html")) {
        fetchHomeProductsData();
    } else if (path.includes("sproduct.html")) {
        fetchProductData();
    } else if (path.includes("shop.html")) {
        fetchProductsData();
    } else if (path.includes("cart.html")) {
        fetchCartData();
    } 
};

if (bar) {
    bar.addEventListener('click', () => {
        navbar.classList.add('active');
    })
}

close.addEventListener('click', () => { 
    navbar.classList.remove('active');
})

signButton.addEventListener('click', () => { 
    window.location.href = 'registration.html';
})

backButton.addEventListener('click', function(event) {
    event.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

let currentIndex = 0;
function showImage(index) {
    const currentActive = document.querySelector('#slider img.active');
    currentActive.classList.remove('active');
    images[index].classList.add('active');
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}
setInterval(nextImage, 4000);


function getProductIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('id');
}

function fetchProductData() {
    const productId = getProductIdFromUrl();
    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            displayProduct(product);
        })
        .catch(error => {
            console.error('Error fetching product data:', error);
        });
}

function fetchProductsData() {
    fetch('https://fakestoreapi.com/products')
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchHomeProductsData() {
    fetch('https://fakestoreapi.com/products?limit=8')
        .then(response => response.json())
        .then(data => {
            displayProducts(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function fetchCartData() {
    fetch('https://fakestoreapi.com/products?limit=4')
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            displayCartProducts(data);
        })
        .catch(error => console.error('Error fetching data:', error));
}

function displayProduct(product) {
    const productContainer = document.getElementById('spd');
    productContainer.innerHTML = `
        <h6>${product.category}</h6>
        <h4>${product.title}</h4>
        <h2>$${product.price}</h2>
        <select>
            <option>Select Option</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
        </select>
        <input type="number" value="1">
        <button class="normal">Add To Cart</button>
        <h4>Product Details</h4>
        <span>${product.description}</span>
    `;
}

function displayProducts(products) {
    const productsContainer = document.getElementById("pro-cont");
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'pro';
        productElement.onclick = function() {
            window.location.href = `sproduct.html?id=${product.id}`;
        };
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <div class="des">
                <span>${product.category}</span>
                <h5>${product.title}</h5>
                <div class="star">
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                    <i class="fas fa-star"></i>
                </div>
                <h4>$${product.price}</h4>
            </div>
            <a href="#"><i class="fa-solid fa-cart-shopping cart"></i></a>
        `;
        productsContainer.appendChild(productElement);
    });
}

function displayCartProducts(product) {
    const cartProductContainer = document.getElementById("cart-data");
    cartProductContainer.innerHTML = `
        <h6>${product.category}</h6>
        <h4>${product.title}</h4>
        <h2>$${product.price}</h2>
        <select>
            <option>Select Option</option>
            <option>S</option>
            <option>M</option>
            <option>L</option>
            <option>XL</option>
            <option>XXL</option>
        </select>
        <input type="number" value="1">
        <button class="normal">Add To Cart</button>
        <h4>Product Details</h4>
        <span>${product.description}</span>
    `;
}

function displayCartProducts(products) {
    const cartProductContainer = document.getElementById("cart-data");

    products.forEach(product => {
        const cartProductElement = document.createElement("tr");
        cartProductElement.innerHTML = `
            <td><a href="#" class="delete-product"><i class="fa-solid fa-circle-xmark"></i></a></td>
            <td><img src="${product.image}" alt="${product.title}"></td>
            <td>${product.title}</td>
            <td>$${product.price}</td>
            <td><input type="number" name="quantity" class="quantity" value="1" min="1"></td>
            <td class="subtotal">$${product.price}</td>
        `;
        cartProductContainer.appendChild(cartProductElement);
        const quantityInput = cartProductElement.querySelector('.quantity');
        const subtotalElement = cartProductElement.querySelector('.subtotal');
        quantityInput.addEventListener('input', function () {
            const quantity = parseInt(quantityInput.value);
            const newSubtotal = (product.price * quantity).toFixed(2);
            subtotalElement.textContent = `$${newSubtotal}`;
            updateCartTotal();
        });
        // Event listener for delete icon
        const deleteProduct = cartProductElement.querySelector('.delete-product');
            deleteProduct.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent the default link behavior
            cartProductElement.remove(); // Remove the product row from the table
            updateCartTotal(); // Update the total after removing the product
        });
    });
    updateCartTotal();
}

function updateCartTotal() {
    const subtotalElements = document.querySelectorAll('.subtotal');
    let total = 0;
    subtotalElements.forEach(subtotalElement => {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', ''));
        total += subtotal;
    });
    document.querySelector('#subtotal #cart-subtotal').textContent = `$${total.toFixed(2)}`;
    document.querySelector('#subtotal #total').textContent = `$${(total+20).toFixed(2)}`;
}
