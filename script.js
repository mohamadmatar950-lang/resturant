// ================= MENU DATA =================
const menuData = [
    { name: "Mega Cheese Burger", price: "$12", desc: "Double patty, triple cheese", cat: "fastfood", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500" },
    { name: "Spicy Zinger", price: "$10", desc: "Crispy chicken", cat: "fastfood", image: "https://images.unsplash.com/photo-1562547256-fa089b6cb92f?w=500" },
    { name: "BBQ Pizza", price: "$15", desc: "Smoked beef pizza", cat: "fastfood", image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=500" },

    { name: "Blue Lagoon", price: "$7", desc: "Citrus drink", cat: "drink", image: "https://images.unsplash.com/photo-1589985643962-42dd7537a994?w=500" },
    { name: "Spanish Latte", price: "$6", desc: "Sweet coffee", cat: "drink", image: "https://images.unsplash.com/photo-1611240506547-c1003fb0b04b?w=500" },

    { name: "Nutella Crepe", price: "$9", desc: "Chocolate crepe", cat: "sweet", image: "https://images.unsplash.com/photo-1585707569937-17563060a1b5?w=500" },
    { name: "Cheesecake", price: "$8", desc: "Berry cheesecake", cat: "sweet", image: "https://images.unsplash.com/photo-1530427568917-4d72a6378869?w=500" }
];

// ================= CART (NOW PERSISTENT) =================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ================= SAVE CART =================
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ================= FILTER MENU =================
function filterMenu(category) {
    const container = document.getElementById("menu-items");

    const filtered = category === "all"
        ? menuData
        : menuData.filter(i => i.cat === category);

    container.innerHTML = filtered.map(item => {
        const index = menuData.indexOf(item);

        return `
        <div class="menu-card">
            <img src="${item.image}" class="menu-img">
            <div class="item-details">
                <h3>${item.name}</h3>
                <p>${item.desc}</p>
                <button onclick="addToCart(${index})" class="add-btn">
                    Add to Cart
                </button>
            </div>
            <div class="item-price">${item.price}</div>
        </div>`;
    }).join('');
}

// ================= ADD TO CART =================
function addToCart(index) {
    const item = menuData[index];

    const existing = cart.find(i => i.name === item.name);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...item, qty: 1 });
    }

    saveCart();
    updateCartUI();
}

// ================= REMOVE ITEM =================
function removeFromCart(index) {
    if (cart[index].qty > 1) {
        cart[index].qty -= 1;
    } else {
        cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
}

// ================= UPDATE CART UI =================
function updateCartUI() {
    const cartCount = document.getElementById("cart-count");
    const cartItems = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");

    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace("$", ""));
        totalItems += item.qty;
        totalPrice += price * item.qty;
    });

    cartCount.innerText = totalItems;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='empty-cart'>Cart is empty</p>";
        cartTotal.innerText = "Total: $0";
        return;
    }

    cartItems.innerHTML = cart.map((item, i) => {
        const price = parseFloat(item.price.replace("$", "")) * item.qty;

        return `
        <div class="cart-item">
            <span>${item.name} x${item.qty}</span>
            <span>$${price}</span>
            <button onclick="removeFromCart(${i})">➖</button>
        </div>`;
    }).join("");

    cartTotal.innerText = "Total: $" + totalPrice;
}

// ================= WHATSAPP ORDER =================
function sendOrder() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const phone = "96171355247";

    let msg = ` NEW ORDER \n\n`;
    msg += ` M.MATAR FOOD\n`;
    msg += ` ${new Date().toLocaleString()}\n\n`;
    msg += `━━━━━━━━━━━━━━\n\n`;

    let total = 0;

    cart.forEach(item => {
        const price = parseFloat(item.price.replace("$", ""));
        const itemTotal = price * item.qty;
        total += itemTotal;

        msg += ` ${item.name}\n`;
        msg += `Qty: ${item.qty}\n`;
        msg += `Total: $${itemTotal}\n\n`;
    });

    msg += `━━━━━━━━━━━━━━\n`;
    msg += ` TOTAL: $${total}\n`;
    msg += `Thank you!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
    filterMenu("all");
    updateCartUI();
});