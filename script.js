let beds = [
  {
    id: 1,
    name: "CloudSoft Upholstered Bed",
    type: "Upholstered",
    size: "Queen",
    price: 699,
    rating: 4.9,
    material: "Soft fabric and timber frame",
    storage: "No",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "A soft upholstered bed designed for modern bedrooms with a plush headboard and calm neutral finish.",
  },
  {
    id: 2,
    name: "Oak Haven Timber Bed",
    type: "Wooden",
    size: "King",
    price: 849,
    rating: 4.8,
    material: "Oak finish timber",
    storage: "No",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    description:
      "A strong timber bed frame with a warm oak look for customers who want a clean and natural bedroom style.",
  },
  {
    id: 3,
    name: "Urban Lift Storage Bed",
    type: "Storage",
    size: "Queen",
    price: 949,
    rating: 4.7,
    material: "Fabric and lift-up storage base",
    storage: "Yes",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "A smart bed frame with hidden storage that helps save space while still looking premium and elegant.",
  },
  {
    id: 4,
    name: "Nordic Calm Platform Bed",
    type: "Platform",
    size: "Double",
    price: 759,
    rating: 4.8,
    material: "Low-profile timber design",
    storage: "No",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    description:
      "A minimal platform bed that suits modern apartments and smaller bedrooms with a simple Scandinavian feel.",
  },
  {
    id: 5,
    name: "Velvet Dream Queen Bed",
    type: "Upholstered",
    size: "Queen",
    price: 899,
    rating: 4.9,
    material: "Velvet upholstery with padded headboard",
    storage: "No",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "A statement bed frame with a rich velvet finish and tall headboard for a more luxurious bedroom look.",
  },
  {
    id: 6,
    name: "SpaceSaver Drawer Bed",
    type: "Storage",
    size: "King",
    price: 999,
    rating: 4.6,
    material: "Timber frame with drawer storage",
    storage: "Yes",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description:
      "A large bed with built-in storage drawers for customers who need both comfort and practical organization.",
  },
];

let mattresses = [
  {
    id: 101,
    name: "DreamCloud Hybrid Mattress",
    firmness: "Medium",
    price: 499,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Balanced support with a soft top layer for most sleepers.",
  },
  {
    id: 102,
    name: "PureRest Memory Foam",
    firmness: "Soft",
    price: 429,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    description: "Pressure-relieving foam designed for comfort and body contouring.",
  },
  {
    id: 103,
    name: "BackSupport Firm Mattress",
    firmness: "Firm",
    price: 559,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    description: "Firm support for customers who prefer a more stable sleep surface.",
  },
];

const typeOptions = ["All", "Upholstered", "Wooden", "Storage", "Platform"];
const sizeOptions = ["All Sizes", "Single", "Double", "Queen", "King"];

let selectedType = "All";
let selectedSize = "All Sizes";
let cart = [];
let activeDetail = null;
let activeDetailSize = "Queen";

const productGrid = document.getElementById("productGrid");
const mattressGrid = document.getElementById("mattressGrid");
const typeFilters = document.getElementById("typeFilters");
const sizeFilters = document.getElementById("sizeFilters");
const searchInput = document.getElementById("searchInput");
const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const cartBackdrop = document.getElementById("cartBackdrop");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const summaryItems = document.getElementById("summaryItems");
const summaryShipping = document.getElementById("summaryShipping");
const summarySubtotal = document.getElementById("summarySubtotal");
const detailModalOverlay = document.getElementById("detailModalOverlay");
const closeDetailModal = document.getElementById("closeDetailModal");
const detailBody = document.getElementById("detailBody");
const checkoutModalOverlay = document.getElementById("checkoutModalOverlay");
const closeCheckoutModal = document.getElementById("closeCheckoutModal");
const checkoutBtn = document.getElementById("checkoutBtn");
const cartCheckoutBtn = document.getElementById("cartCheckoutBtn");
const checkoutSummary = document.getElementById("checkoutSummary");
const placeOrderBtn = document.getElementById("placeOrderBtn");

async function loadCMSData() {
  try {
    const [productsRes, mattressesRes] = await Promise.all([
      fetch("/data/products.json"),
      fetch("/data/mattresses.json"),
    ]);

    if (productsRes.ok) {
      const cmsBeds = await productsRes.json();
      beds = cmsBeds.map((item, index) => ({ id: index + 1, ...item }));
    }

    if (mattressesRes.ok) {
      const cmsMattresses = await mattressesRes.json();
      mattresses = cmsMattresses.map((item, index) => ({ id: 101 + index, ...item }));
    }
  } catch (error) {
    console.warn("CMS data not available, using fallback static products.", error);
  }
}

function renderTypeFilters() {
  if (!typeFilters) return;
  typeFilters.innerHTML = "";
  typeOptions.forEach((type) => {
    const button = document.createElement("button");
    button.className = `filter-btn ${selectedType === type ? "active" : ""}`;
    button.textContent = type;
    button.addEventListener("click", () => {
      selectedType = type;
      renderTypeFilters();
      renderProducts();
    });
    typeFilters.appendChild(button);
  });
}

function renderSizeFilters() {
  if (!sizeFilters) return;
  sizeFilters.innerHTML = "";
  sizeOptions.forEach((size) => {
    const button = document.createElement("button");
    button.className = `size-btn ${selectedSize === size ? "active" : ""}`;
    button.textContent = size;
    button.addEventListener("click", () => {
      selectedSize = size;
      renderSizeFilters();
      renderProducts();
    });
    sizeFilters.appendChild(button);
  });
}

function getFilteredBeds() {
  const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
  return beds.filter((bed) => {
    const matchType = selectedType === "All" || bed.type === selectedType;
    const matchSize = selectedSize === "All Sizes" || bed.size === selectedSize;
    const matchKeyword = bed.name.toLowerCase().includes(keyword);
    return matchType && matchSize && matchKeyword;
  });
}

function renderProducts() {
  if (!productGrid) return;
  productGrid.innerHTML = "";
  const filtered = getFilteredBeds();

  if (filtered.length === 0) {
    productGrid.innerHTML = '<div class="empty">No beds match your current filters.</div>';
    return;
  }

  filtered.forEach((bed) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${bed.image}" alt="${bed.name}">
      <div class="product-info">
        <div class="product-top">
          <div>
            <p class="product-type">${bed.type} · ${bed.size}</p>
            <h3 class="product-name">${bed.name}</h3>
          </div>
          <p class="price">$${bed.price}</p>
        </div>
        <p class="rating">⭐ ${bed.rating}</p>
        <div class="card-actions">
          <button class="view-btn" data-view="${bed.id}">View Details</button>
          <button class="add-btn" data-add="${bed.id}">Add to Cart</button>
        </div>
      </div>
    `;
    productGrid.appendChild(card);
  });

  document.querySelectorAll("[data-add]").forEach((button) => {
    button.addEventListener("click", () => addToCart(Number(button.dataset.add)));
  });

  document.querySelectorAll("[data-view]").forEach((button) => {
    button.addEventListener("click", () => openDetailModal(Number(button.dataset.view)));
  });
}

function renderMattresses() {
  if (!mattressGrid) return;
  mattressGrid.innerHTML = "";
  mattresses.forEach((item) => {
    const card = document.createElement("div");
    card.className = "mattress-card";
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="mattress-content">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p><strong>Firmness:</strong> ${item.firmness}</p>
        <p class="price">$${item.price}</p>
        <button class="btn secondary full-btn">View Mattress</button>
      </div>
    `;
    mattressGrid.appendChild(card);
  });
}

function openDetailModal(id) {
  const bed = beds.find((item) => item.id === id);
  activeDetail = bed;
  activeDetailSize = bed.size;
  renderDetailModal();
  detailModalOverlay.classList.add("show");
}

function renderDetailModal() {
  if (!activeDetail) return;

  const detailSizes = ["Single", "Double", "Queen", "King"];
  detailBody.innerHTML = `
    <div class="detail-image">
      <img src="${activeDetail.image}" alt="${activeDetail.name}">
    </div>
    <div class="detail-info">
      <h2>${activeDetail.name}</h2>
      <div class="detail-meta">${activeDetail.type} · ${activeDetail.rating} rating · $${activeDetail.price}</div>
      <p>${activeDetail.description}</p>
      <div class="spec-list">
        <div class="spec-item"><span>Material</span><strong>${activeDetail.material}</strong></div>
        <div class="spec-item"><span>Storage</span><strong>${activeDetail.storage}</strong></div>
        <div class="spec-item"><span>Recommended size</span><strong>${activeDetail.size}</strong></div>
      </div>
      <h4>Choose size</h4>
      <div class="size-picker">
        ${detailSizes
          .map(
            (size) => `<button class="chip ${activeDetailSize === size ? "active" : ""}" data-detail-size="${size}">${size}</button>`
          )
          .join("")}
      </div>
      <div class="card-actions">
        <button class="view-btn" id="closeDetailAction">Close</button>
        <button class="add-btn" id="detailAddBtn">Add to Cart</button>
      </div>
    </div>
  `;

  document.querySelectorAll("[data-detail-size]").forEach((button) => {
    button.addEventListener("click", () => {
      activeDetailSize = button.dataset.detailSize;
      renderDetailModal();
    });
  });

  document.getElementById("closeDetailAction").addEventListener("click", () => {
    detailModalOverlay.classList.remove("show");
  });

  document.getElementById("detailAddBtn").addEventListener("click", () => {
    addToCart(activeDetail.id, activeDetailSize);
    detailModalOverlay.classList.remove("show");
  });
}

function addToCart(id, chosenSize = null) {
  const product = beds.find((item) => item.id === id);
  const size = chosenSize || product.size;
  const existing = cart.find((item) => item.id === id && item.selectedSize === size);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, selectedSize: size, qty: 1 });
  }

  renderCart();
}

function updateQty(id, selectedSize, change) {
  cart = cart
    .map((item) =>
      item.id === id && item.selectedSize === selectedSize
        ? { ...item, qty: item.qty + change }
        : item
    )
    .filter((item) => item.qty > 0);

  renderCart();
}

function renderCart() {
  if (!cartItems) return;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty">Your cart is empty.</div>';
  } else {
    cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>${item.selectedSize} · $${item.price}</p>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${item.id}" data-size="${item.selectedSize}" data-change="-1">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-size="${item.selectedSize}" data-change="1">+</button>
          </div>
        </div>
      `;
      cartItems.appendChild(row);
    });
  }

  document.querySelectorAll(".qty-btn").forEach((button) => {
    button.addEventListener("click", () => {
      updateQty(Number(button.dataset.id), button.dataset.size, Number(button.dataset.change));
    });
  });

  const items = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = items > 0 ? 49 : 0;

  if (cartCount) cartCount.textContent = items;
  if (cartTotal) cartTotal.textContent = (subtotal + shipping).toFixed(2);
  if (summaryItems) summaryItems.textContent = items;
  if (summaryShipping) summaryShipping.textContent = `$${shipping}`;
  if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;

  renderCheckoutSummary();
}

function renderCheckoutSummary() {
  if (!checkoutSummary) return;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 49 : 0;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    checkoutSummary.innerHTML = '<div class="empty">Your cart is empty.</div>';
    return;
  }

  checkoutSummary.innerHTML = `
    ${cart
      .map(
        (item) => `
        <div class="checkout-row checkout-item-row">
          <span>${item.name} (${item.selectedSize}) × ${item.qty}</span>
          <strong>$${(item.price * item.qty).toFixed(2)}</strong>
        </div>
      `
      )
      .join("")}
    <div class="checkout-divider"></div>
    <div class="checkout-row checkout-item-row"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
    <div class="checkout-row checkout-item-row"><span>Shipping</span><strong>$${shipping.toFixed(2)}</strong></div>
    <div class="checkout-row checkout-total"><span>Total</span><strong>$${total.toFixed(2)}</strong></div>
  `;
}

function openCart() {
  if (cartDrawer) cartDrawer.classList.add("show");
}

function closeCartDrawer() {
  if (cartDrawer) cartDrawer.classList.remove("show");
}

function openCheckout() {
  renderCheckoutSummary();
  if (checkoutModalOverlay) checkoutModalOverlay.classList.add("show");
}

if (searchInput) {
  searchInput.addEventListener("input", renderProducts);
}
if (cartBtn) {
  cartBtn.addEventListener("click", openCart);
}
if (cartBackdrop) {
  cartBackdrop.addEventListener("click", closeCartDrawer);
}
if (closeCart) {
  closeCart.addEventListener("click", closeCartDrawer);
}
if (closeDetailModal && detailModalOverlay) {
  closeDetailModal.addEventListener("click", () => detailModalOverlay.classList.remove("show"));
}
if (detailModalOverlay) {
  detailModalOverlay.addEventListener("click", (e) => {
    if (e.target === detailModalOverlay) {
      detailModalOverlay.classList.remove("show");
    }
  });
}
if (checkoutBtn) {
  checkoutBtn.addEventListener("click", openCheckout);
}
if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener("click", openCheckout);
}
if (closeCheckoutModal && checkoutModalOverlay) {
  closeCheckoutModal.addEventListener("click", () => checkoutModalOverlay.classList.remove("show"));
}
if (checkoutModalOverlay) {
  checkoutModalOverlay.addEventListener("click", (e) => {
    if (e.target === checkoutModalOverlay) {
      checkoutModalOverlay.classList.remove("show");
    }
  });
}
if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    alert("Demo order placed successfully!");
    cart = [];
    renderCart();
    closeCartDrawer();
    if (checkoutModalOverlay) checkoutModalOverlay.classList.remove("show");
  });
}

async function init() {
  await loadCMSData();
  renderTypeFilters();
  renderSizeFilters();
  renderProducts();
  renderMattresses();
  renderCart();
  initLayerScrollReveal();
}

init();

function initLayerScrollReveal() {
  const layers = document.querySelectorAll(".layer-card");
  if (!layers.length) return;
  let revealOffset = window.innerHeight * 0.8;

  function updateLayerVisibility() {
    layers.forEach((layer, index) => {
      const rect = layer.getBoundingClientRect();
      if (rect.top < revealOffset) {
        setTimeout(() => layer.classList.add("visible"), index * 80);
      }
    });
  }

  updateLayerVisibility();
  window.addEventListener("scroll", updateLayerVisibility);
  window.addEventListener("resize", () => {
    revealOffset = window.innerHeight * 0.8;
    updateLayerVisibility();
  });
}
