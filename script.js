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

function renderInCart(product){
  let listProduct = document.createElement("span");
  listProduct.classList.add("list-product");

  let listProductText = document.createElement("div");
  listProductText.classList.add("list-product-text");

  let heading = document.createElement("h3");
  heading.textContent = product.name;
  listProductText.append(heading);
  listProduct.append(listProductText);

  let productPrices = document.createElement("span");
  productPrices.classList.add("product-prices");

  let productAmount = document.createElement("p");
  productAmount.classList.add("product-amount");
  productAmount.textContent = "1x";
  productPrices.append(productAmount);

  let onePrice = document.createElement("p");
  onePrice.classList.add("one-price");
  onePrice.textContent = `@$${product.price.toFixed(2)}`;
  productPrices.append(onePrice);

  let totalPrice = document.createElement("p");
  totalPrice.classList.add("total-price");
  totalPrice.textContent = `$${product.price.toFixed(2)}`;
  productPrices.append(totalPrice);
  listProductText.append(productPrices);
  

  let removeDiv = document.createElement("div");
  removeDiv.classList.add("remove-item");
  let removeIcon = document.createElement("img");
  removeIcon.src = "./assets/images/icon-remove-item.svg";
  removeIcon.atl = "Remove item from cart";
  removeDiv.append(removeIcon);
  listProduct.append(removeDiv);

  productsOnCart.append(listProduct);
}

window.addEventListener("load", getProducts);
 