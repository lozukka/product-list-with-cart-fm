const productCards = document.getElementById("product-cards");
const selectedCart = document.getElementById("selected-cart");
const emptyCart = document.getElementById("empty-card");
const totalItemsText = document.getElementById("total-items");
const productsOnCart = document.getElementById("products-on-cart");
const cartItems = [];
let products = [];
let totalItems = 0;
let cartSum = 0;

document.addEventListener("click", (e) => {
  const add = e.target.closest(".add-to-cart");
  const rem = e.target.closest(".remove-item");
  if (add) {
    const productCard = add.closest(".product-card");
    const id = productCard.dataset.id;
    addToCart(id);
  }
  if (rem) {
    const listProduct = rem.closest(".list-product");
    const id = listProduct.dataset.id;
    totalItems--;
    totalItemsText.textContent = totalItems;
    removeItem(listProduct);
  }
});

async function getProducts() {
  products = await fetchProducts();

  products.forEach((product) => {
    product.id = generateId();
    const { id, image, name, category, price } = product;
    renderProducts(id, image, name, category, price);
  });
}
async function fetchProducts() {
  try {
    const response = await fetch("./data.json");
    if (!response.ok) throw new Error("Failed to load products");

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}

function renderProducts(id, image, name, category, price) {
  const productCard = document.createElement("section");
  productCard.classList.add("product-card");
  productCard.dataset.id = id;

  productCard.innerHTML = `
    <div class="image" style="background-image: url(${image.mobile});"></div>
    <button class="add-to-cart">
      <img src="./assets/images/icon-add-to-cart.svg" alt="Add to Cart" />
      <span>Add to Cart</span>
    </button>
    <p class="category">${category}</p>
    <h2 class="name">${name}</h2>
    <p class="price">$${price.toFixed(2)}</p>
  `;

  productCards.appendChild(productCard);
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function addToCart(id) {
  if (selectedCart.classList.contains("hidden")) {
    emptyCart.classList.replace("show", "hidden");
    selectedCart.classList.replace("hidden", "show");
  }
  const product = products.find((p) => p.id == id);
  if (!product) {
    console.warn("Product can't be found with id: ", id);
    return;
  }
  renderInCart(product);

  totalItems++;
  totalItemsText.textContent = totalItems;
}

function renderInCart(product) {
  const listProduct = document.createElement("span");
  listProduct.classList.add("list-product");
  listProduct.innerHTML = `
    <div class="list-product-text">
      <h3>${product.name}</h3>
      <span class="product-prices">
        <p class="product-amount">1x</p>
        <p class="one-price">@$${product.price.toFixed(2)}</p>
        <p class="total-price">$${product.price.toFixed(2)}</p>
      </span>
    </div>
    <div class="remove-item">
      <img src="./assets/images/icon-remove-item.svg" alt="Remove item from cart">
    </div>
  `;

  productsOnCart.append(listProduct);
}

function removeItem(listProduct) {
  console.log("removed:", listProduct);
}

window.addEventListener("load", getProducts);
