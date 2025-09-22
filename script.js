const productCards = document.getElementById("product-cards");
const selectedCart = document.getElementById("selected-cart");
const emptyCart = document.getElementById("empty-card");
const totalItemsText =document.getElementById("total-items");
const cartItems = [];
let totalItems = 0;
let cartSum = 0;

document.querySelectorAll(".remove-item").forEach(btn =>{
  btn.addEventListener("click", ()=>{
    totalItems--;
    totalItemsText.textContent=totalItems;
  })
})

document.addEventListener("click", (e) => {
  if (e.target.closest(".add-to-cart")) {
    console.log("added");
    addToCart();
  }
});

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
  let id = generateId();
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

function addToCart() {
  
  totalItems ++;
  totalItemsText.textContent = totalItems;
  if(selectedCart.classList.contains("hidden")){
    emptyCart.classList.replace("show", "hidden");
    selectedCart.classList.replace("hidden", "show");
  }


}

window.addEventListener("load", getProducts);
 