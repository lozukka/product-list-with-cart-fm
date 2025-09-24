const productCards = document.getElementById("product-cards");
const selectedCart = document.getElementById("selected-cart");
const emptyCart = document.getElementById("empty-card");
const totalItemsText = document.getElementById("total-items");
const productsOnCart = document.getElementById("products-on-cart");
const sumDisplay = document.getElementById("total-sum");
const confirmOrderBtn = document.getElementById("confirm-order");
const closePopupBtn = document.getElementById("close-popup");
const popup = document.getElementById("popup-wrapper");
const confirmOrderList = document.getElementById("confirmed-order-list");
const confirmedTotalSum = document.getElementById("confirmed-sum");
const cartItems = [];
let products = [];
let totalItems = 0;
let cartSum = 0;

document.addEventListener("click", (e) => {
  const add = e.target.closest(".add-to-cart");
  const rem = e.target.closest(".remove-item");
  const increment = e.target.closest(".increment");
  const decrement = e.target.closest(".decrement");
  if (add) {
    const productCard = add.closest(".product-card");
    const id = productCard.dataset.id;
    addToCart(id);
    replaceButton(add);
  }
  if (rem) {
    const listProduct = rem.closest(".list-product");
    const id = listProduct.dataset.id;
    totalItems--;
    totalItemsText.textContent = totalItems;
    console.log(listProduct);
    removeItem(listProduct);
  }
  if (increment) {
    const wrapper = increment.closest(".add-more-to-cart");
    const span = wrapper.querySelector("span");
    let qty = parseInt(span.textContent, 10);
    span.textContent = ++qty;
    const addMore = increment.closest(".product-card");
    const id = addMore.dataset.id;
    updateCart(wrapper.closest(".product-card").dataset.id, qty);
  }
  if (decrement) {
    const wrapper = decrement.closest(".add-more-to-cart");
    const span = wrapper.querySelector("span");
    const productCard = decrement.closest(".product-card");
    const id = productCard.dataset.id;
    let qty = parseInt(span.textContent, 10);
    if (qty > 1) {
      span.textContent = --qty;

      updateCart(wrapper.closest(".product-card").dataset.id, qty);
    } else {
      const listProduct = document.querySelector(
        `.list-product[data-id="${id}"]`
      );
      if (listProduct) {
        removeItem(listProduct); // oma funktiosi
      }
      addCartButton(productCard); // korvaa nappi takaisin Add to cartiksi
    }
    //change div to button & remove from cart
    //update the add more to cart -element span
    //update in the cart: amount + item total price -> update cart sum
    //check if amount is 0 -> change div to button & remove from cart
  }
});

confirmOrderBtn.addEventListener("click", () => confirmOrder());
closePopupBtn.addEventListener("click", () => closePopup());

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
  const product = products.find((p) => p.id == id);
  if (!product) {
    console.warn("Product can't be found with id: ", id);
    return;
  }
  renderInCart(product);
  cartItems.push(product);
  console.log(cartItems);
  totalItems++;
  totalItemsText.textContent = totalItems;
  checkIfCartEmpty();
}
function checkIfCartEmpty() {
  if (cartItems.length > 0) {
    emptyCart.classList.replace("show", "hidden");
    selectedCart.classList.replace("hidden", "show");
  } else {
    emptyCart.classList.replace("hidden", "show");
    selectedCart.classList.replace("show", "hidden");
  }
}
function renderInCart(product) {
  const listProduct = document.createElement("span");
  listProduct.classList.add("list-product");
  listProduct.dataset.id = product.id;
  listProduct.dataset.price = product.price;
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
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="currentColor" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg> 
    </div>
  `;

  productsOnCart.append(listProduct);
  updateCartSum();
}
function updateCart(id, qty) {
  const listProduct = document.querySelector(`.list-product[data-id="${id}"]`);
  if (!listProduct) return;

  const price = parseFloat(listProduct.dataset.price);

  listProduct.querySelector(".product-amount").textContent = qty + "x";
  listProduct.querySelector(".total-price").textContent =
    "$" + (qty * price).toFixed(2);

  updateCartSum();
}
function removeItem(listProduct) {
  const price = parseFloat(listProduct.dataset.price);
  const id = listProduct.dataset.id;

  cartSum -= price;
  sumDisplay.textContent = `$${cartSum.toFixed(2)}`;

  listProduct.remove();

  const index = cartItems.findIndex((item) => item.id === id);
  if (index !== -1) {
    cartItems.splice(index, 1);
  }
  checkIfCartEmpty();
}

function updateCartSum() {
  let total = 0;
  document.querySelectorAll(".list-product").forEach((item) => {
    const qty = parseInt(item.querySelector(".product-amount").textContent);
    const price = parseFloat(item.dataset.price);
    total += qty * price;
  });

  cartSum = total;
  sumDisplay.textContent = `$${total.toFixed(2)}`;
}

function confirmOrder() {
  popup.classList.add("open-popup");
  document.body.classList.add("no-scroll");

  cartItems.forEach((product) => {
    const { id, image, name, category, price } = product;
    renderConfirmedProducts(product);
    console.log(product);
  });

  confirmedTotalSum.textContent = `$${cartSum.toFixed(2)}`;
}

function closePopup() {
  popup.classList.remove("open-popup");
  document.body.classList.remove("no-scroll");
  cartSum = 0;
  sumDisplay.textContent = `$00`;
  cartItems.splice(0, cartItems.length);
  totalItemsText.textContent = 0;
  productsOnCart.innerHTML = "";
  checkIfCartEmpty();
}

function renderConfirmedProducts(product) {
  const listItem = document.createElement("div");
  listItem.classList.add("confirmed-order-list-item");
  listItem.dataset.id = product.id;
  listItem.dataset.price = product.price;
  listItem.innerHTML = `
  <div class="thumbnail-image" style="background-image: url(${
    product.image.thumbnail
  });"></div>
  <div class="confirmed-order-text">
  <h3>${product.name}</h3>
  <div class="confirmed-price">
  <p class="confirmed-item-count">1x</p>
  <p class="confirmed-item-price">@$${product.price.toFixed(2)}</p>
  </div>
  </div>
  <p class="confirmed-single-total">$${product.price.toFixed(2)}</p>
  </div>
 `;
  confirmOrderList.append(listItem);
}

function replaceButton(add) {
  const addMoreToCartBtn = document.createElement("div");
  addMoreToCartBtn.classList.add("add-more-to-cart");
  addMoreToCartBtn.innerHTML = `
  <button class="decrement">
  <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="2"
        fill="none"
        viewBox="0 0 10 2"
      >
        <path fill="currentColor" d="M0 .375h10v1.25H0V.375Z" />
      </svg>
    </button>
    <span>1</span>
    <button class="increment">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="10"
        fill="none"
        viewBox="0 0 10 10"
      >
        <path
          fill="currentColor"
          d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"
        />
      </svg>
    </button>
  `;
  add.replaceWith(addMoreToCartBtn);
}
function addCartButton(productCard) {
  const cartButton = document.createElement("button");
  cartButton.classList.add("add-to-cart");
  cartButton.innerHTML = `
            <img src="./assets/images/icon-add-to-cart.svg" alt="" /> Add to
            Cart`;
  const oldDiv = productCard.querySelector(".add-more-to-cart");
  oldDiv.replaceWith(cartButton);
}
window.addEventListener("load", getProducts);
