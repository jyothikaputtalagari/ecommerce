/* =========================
   PRODUCTS (15)
========================= */
const products = [
  {id:"p1",title:"Cloud Knit Sweater",price:1699,rating:4.6,category:"clothing",image:"https://i.pinimg.com/originals/d2/6a/12/d26a12cd30a78a49cba792a651777496.jpg",description:"Cozy knit for cool evenings."},
  {id:"p2",title:"Sunny Tote Bag",price:699,rating:4.1,category:"accessories",image:"https://i.ebayimg.com/images/g/oCYAAOSwxTZlNBH7/s-l500.jpg",description:"Sustainable everyday tote."},
  {id:"p3",title:"Gingham Dress",price:2499,rating:4.8,category:"clothing",image:"https://i.pinimg.com/originals/6f/2e/39/6f2e392578a5eb3aa294a39b9b78162f.jpg",description:"Slip dress for any occasion."},
  {id:"p4",title:"Cloud-Step Sneakers",price:3000,rating:4.5,category:"shoes",image:"https://www.travelandleisure.com/thmb/ypfUn7xJBbSCXZv0McNPRjtXRhw=/1500x0/filters:no_upscale():strip_icc()/cloud-5-coast-running-sneaker.jpg",description:"Everyday comfort sneakers."},
  {id:"p5",title:"Pearl Hair Clips",price:499,rating:4.2,category:"accessories",image:"https://tse4.mm.bing.net/th/id/OIP.rjC4RFZJJmxB5UT8Nn7ZIQHaHa",description:"Minimal pearl accessories."},
  {id:"p6",title:"Satin Scarf",price:599,rating:3.9,category:"accessories",image:"https://th.bing.com/th/id/OIP.SuG95Dk8T6IQ5iGw9P_IsgHaHa",description:"Silky printed scarf."},
  {id:"p7",title:"Relaxed Linen Shirt",price:1899,rating:4.4,category:"clothing",image:"https://picsum.photos/400?1",description:"Breathable linen essential."},
  {id:"p8",title:"Minimal Gold Ring",price:1299,rating:4.7,category:"accessories",image:"https://picsum.photos/400?2",description:"Elegant everyday ring."},
  {id:"p9",title:"Soft Ballet Flats",price:2599,rating:4.3,category:"shoes",image:"https://picsum.photos/400?3",description:"Comfortable classic flats."},
  {id:"p10",title:"Oversized Cardigan",price:2799,rating:4.6,category:"clothing",image:"https://picsum.photos/400?4",description:"Cozy layering staple."},
  {id:"p11",title:"Mini Backpack",price:2199,rating:4.2,category:"accessories",image:"https://picsum.photos/400?5",description:"Compact backpack."},
  {id:"p12",title:"White Sneakers",price:3499,rating:4.5,category:"shoes",image:"https://picsum.photos/400?6",description:"Clean minimal sneakers."},
  {id:"p13",title:"Cotton Lounge Pants",price:1599,rating:4.1,category:"clothing",image:"https://picsum.photos/400?7",description:"Relaxed comfort wear."},
  {id:"p14",title:"Pendant Necklace",price:1799,rating:4.8,category:"accessories",image:"https://picsum.photos/400?8",description:"Subtle shine piece."},
  {id:"p15",title:"Classic Loafers",price:4299,rating:4.6,category:"shoes",image:"https://picsum.photos/400?9",description:"Timeless loafers."}
];

/* =========================
   HELPERS / STATE
========================= */
const qs = s => document.querySelector(s);

let state = {
  cart: JSON.parse(localStorage.getItem("cart")) || {},
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || {},
  filters: { q:"", category:"all", sort:"featured" }
};

/* =========================
   DOM REFS
========================= */
const productsGrid = qs("#productsGrid");
const cartPanel = qs("#cartPanel");
const wishlistPanel = qs("#wishlistPanel");
const cartItems = qs("#cartItems");
const wishlistItems = qs("#wishlistItems");
const cartSubtotal = qs("#cartSubtotal");
const cartCount = qs("#cartCount");
const wishlistCount = qs("#wishlistCount");
const overlay = qs("#overlay");

/* MODAL */
const modal = qs("#productModal");
const modalImage = qs("#modalImage");
const modalTitle = qs("#modalTitle");
const modalDesc = qs("#modalDesc");
const modalPrice = qs("#modalPrice");
const modalRating = qs("#modalRating");
const modalWish = qs("#modalWish");
const closeModalBtn = qs("#closeModal");
const qtyDisplay = qs("#qtyDisplay");
const qtyPlus = qs("#qtyPlus");
const qtyMinus = qs("#qtyMinus");
const modalAdd = qs("#modalAdd");

let currentProduct = null;

/* =========================
   PRODUCTS RENDER
========================= */
function renderProducts(){
  let list = products.filter(p =>
    (state.filters.category === "all" || p.category === state.filters.category) &&
    p.title.toLowerCase().includes(state.filters.q)
  );

  if(state.filters.sort === "price-asc") list.sort((a,b)=>a.price-b.price);
  if(state.filters.sort === "price-desc") list.sort((a,b)=>b.price-a.price);
  if(state.filters.sort === "rating-desc") list.sort((a,b)=>b.rating-a.rating);

  productsGrid.innerHTML = "";

  list.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb"><img src="${p.image}" alt="${p.title}"></div>
      <h3>${p.title}</h3>
      <div class="rating">${p.rating} ⭐</div>
      <div class="price">₹${p.price}</div>
      <div class="card-actions">
        <button class="wish-btn">${state.wishlist[p.id] ? "♥" : "♡"}</button>
        <button class="add-btn">Add</button>
      </div>
    `;

    card.querySelector(".thumb").onclick = ()=>openModal(p);
    card.querySelector(".add-btn").onclick = ()=>addToCart(p.id,1);
    card.querySelector(".wish-btn").onclick = e=>{
      toggleWishlist(p.id);
      e.target.textContent = state.wishlist[p.id] ? "♥" : "♡";
    };

    productsGrid.appendChild(card);
  });
}

/* =========================
   MODAL
========================= */
function openModal(p){
  currentProduct = p;
  modalImage.src = p.image;
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.description;
  modalPrice.textContent = `₹${p.price}`;
  modalRating.textContent = `${p.rating} ⭐`;
  qtyDisplay.textContent = 1;
  modalWish.textContent = state.wishlist[p.id] ? "♥" : "♡";

  modal.classList.add("open");
  overlay.classList.add("show");
}

function closeModal(){
  modal.classList.remove("open");
  overlay.classList.remove("show");
}

qtyPlus.onclick = ()=> qtyDisplay.textContent = +qtyDisplay.textContent + 1;
qtyMinus.onclick = ()=> {
  if (+qtyDisplay.textContent > 1)
    qtyDisplay.textContent = +qtyDisplay.textContent - 1;
};

modalWish.onclick = ()=>{
  toggleWishlist(currentProduct.id);
  modalWish.textContent = state.wishlist[currentProduct.id] ? "♥" : "♡";
};

modalAdd.onclick = ()=>{
  addToCart(currentProduct.id, +qtyDisplay.textContent);
  closeModal();
};

closeModalBtn.onclick = closeModal;

/* =========================
   CART (FIXED)
========================= */
function addToCart(id, qtyChange) {
  const currentQty = state.cart[id] ?? 0;
  if (currentQty === 0 && qtyChange < 0) return;

  const newQty = currentQty + qtyChange;
  if (newQty <= 0) delete state.cart[id];
  else state.cart[id] = newQty;

  localStorage.setItem("cart", JSON.stringify(state.cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML = "";
  let total = 0;
  const entries = Object.entries(state.cart);

  if(!entries.length){
    cartItems.innerHTML =
      "<p style='text-align:center;color:#aaa'>Your cart is empty ✨</p>";
  }

  entries.forEach(([id,qty])=>{
    const p = products.find(x=>x.id===id);
    if(!p) return;

    total += p.price * qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}">
        <div class="cart-info">
          <div class="cart-top">
            <span class="cart-title">${p.title}</span>
            <div class="qty-controls">
              <button onclick="addToCart('${id}',-1)">−</button>
              <span>${qty}</span>
              <button onclick="addToCart('${id}',1)">+</button>
            </div>
          </div>
          <div class="cart-price">₹${p.price}</div>
        </div>
      </div>
    `;
  });

  cartSubtotal.textContent = `₹${total}`;
  cartCount.textContent = entries.reduce((a,[,q])=>a+q,0);
}

function openCart(){
  renderCart();
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCart(){
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

/* =========================
   WISHLIST
========================= */
function toggleWishlist(id){
  state.wishlist[id] ? delete state.wishlist[id] : state.wishlist[id]=true;
  localStorage.setItem("wishlist",JSON.stringify(state.wishlist));
  renderWishlistCount();
}

function renderWishlist(){
  wishlistItems.innerHTML="";
  const ids = Object.keys(state.wishlist);

  if(!ids.length){
    wishlistItems.innerHTML =
      "<p style='text-align:center;color:#aaa'>Wishlist is empty 💔</p>";
  }

  ids.forEach(id=>{
    const p = products.find(x=>x.id===id);
    wishlistItems.innerHTML += `
      <div class="cart-item">
        <img src="${p.image}">
        <div>
          <strong>${p.title}</strong>
          <div>₹${p.price}</div>
        </div>
        <button onclick="moveToCart('${id}')">Move</button>
      </div>
    `;
  });
}

function moveToCart(id){
  addToCart(id,1);
  delete state.wishlist[id];
  localStorage.setItem("wishlist",JSON.stringify(state.wishlist));
  renderWishlist();
  renderWishlistCount();
}

function renderWishlistCount(){
  wishlistCount.textContent = Object.keys(state.wishlist).length;
}

/* =========================
   EVENTS
========================= */
qs("#cartBtn").onclick = openCart;
qs("#wishlistBtn").onclick = ()=>{
  renderWishlist();
  wishlistPanel.classList.add("open");
  overlay.classList.add("show");
};

qs("#closeCart").onclick = closeCart;
qs("#closeWishlist").onclick = ()=>{
  wishlistPanel.classList.remove("open");
  overlay.classList.remove("show");
};

overlay.onclick = ()=>{
  closeCart();
  closeModal();
  wishlistPanel.classList.remove("open");
};

/* FILTERS */
qs("#searchInput").oninput = e=>{
  state.filters.q = e.target.value.toLowerCase();
  renderProducts();
};
qs("#categoryFilter").onchange = e=>{
  state.filters.category = e.target.value;
  renderProducts();
};
qs("#sortSelect").onchange = e=>{
  state.filters.sort = e.target.value;
  renderProducts();
};
qs("#clearFilters").onclick = ()=>{
  state.filters = {q:"",category:"all",sort:"featured"};
  qs("#searchInput").value="";
  qs("#categoryFilter").value="all";
  qs("#sortSelect").value="featured";
  renderProducts();
};

/* INIT */
document.addEventListener("DOMContentLoaded", ()=>{
  renderProducts();
  renderWishlistCount();
});
