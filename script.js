const productCards = document.getElementById("product-cards");
const selectedCart = document.getElementById("selected-cart");
const emptyCart = document.getElementById("empty-card");
const totalItemsText =document.getElementById("total-items");
const productsOnCart = document.getElementById("products-on-cart");
const cartItems = [];
let products = [];
let totalItems = 0;
let cartSum = 0;

document.querySelectorAll(".remove-item").forEach(btn =>{
  btn.addEventListener("click", ()=>{
    totalItems--;
    totalItemsText.textContent=totalItems;
  })
})

document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (btn) {
    const productCard = btn.closest(".product-card");
    const id = productCard.dataset.id;
    addToCart(id);
  }
});

async function getProducts() {
  products = await fetchProducts();

  products.forEach((product) => {
    product.id = generateId();
    const {id, image, name, category, price} = product;
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
  let productCard = document.createElement("section");
  productCard.classList.add("product-card");
  productCard.setAttribute("data-id", `${id}`)
  let productImage = document.createElement("div");
  productImage.classList.add("image");
  productImage.style.backgroundImage = `url(${image.mobile})`;
  productCard.appendChild(productImage);
  let cartButton = document.createElement("button");
  cartButton.classList.add("add-to-cart");
  let cartIcon = document.createElement("img");
  cartIcon.src = "./assets/images/icon-add-to-cart.svg";
  let cartText = document.createElement("span");
  cartText.textContent = "Add to Cart";
  cartButton.append(cartIcon, cartText);
  productCard.appendChild(cartButton);
  let categoryText = document.createElement("p");
  categoryText.classList.add("category");
  categoryText.textContent = category;
  productCard.appendChild(categoryText);
  let nameText = document.createElement("h2");
  nameText.classList.add("name");
  nameText.textContent = name;
  productCard.appendChild(nameText);
  let priceText = document.createElement("p");
  priceText.classList.add("price");
  priceText.textContent = `$${price.toFixed(2)}`;
  productCard.appendChild(priceText);
  productCards.appendChild(productCard);
}

function generateId(){
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function addToCart(id) {
  if(selectedCart.classList.contains("hidden")){
    emptyCart.classList.replace("show", "hidden");
    selectedCart.classList.replace("hidden", "show");
  }
const product = products.find(p => p.id == id);
if(!product) {
  console.warn ("Product can't be found with id: ", id);
  return;
}
  renderInCart(product);

  totalItems ++;
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


window.addEventListener("load", getProducts);
 