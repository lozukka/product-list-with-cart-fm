let productCards = document.getElementById("product-cards");
let selectedCart = document.getElementById("selected-cart");
let emptyCart = document.getElementById("empty-card");
let cartItems = [];
let totalItems = 0;
let cartSum = 0;

async function getProducts() {
  const products = await fetchProducts();

  products.forEach(({ image, name, category, price }) => {
    renderProducts(image, name, category, price);
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

function renderProducts(image, name, category, price) {
  let productCard = document.createElement("section");
  productCard.classList.add("product-card");
  let productImage = document.createElement("div");
  productImage.classList.add("image");
  productImage.style.backgroundImage = `url(${image.mobile})`;
  productCard.appendChild(productImage);
  let cartButton = document.createElement("button");
  cartButton.setAttribute("onclick", "addToCartBtn()")
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

function addToCartBtn() {
  let totalItemsText =document.getElementById("total-items")
  totalItems ++;
  totalItemsText.textContent = totalItems;
  if(selectedCart.classList.contains("hidden")){
    emptyCart.classList.replace("show", "hidden");
    selectedCart.classList.replace("hidden", "show");
  }
}

window.addEventListener("load", getProducts);
 