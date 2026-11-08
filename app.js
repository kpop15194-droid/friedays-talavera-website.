/*
 * FRIEDAYS WEBSITE CONFIGURATION
 * 1) Replace facebookPageUrl with the branch's real Facebook Page URL.
 * 2) Add exact product names/prices confirmed by the owner in MENU below.
 * 3) Do not publish proposed promotions as active until approved.
 */
const CONFIG = {
  facebookPageUrl: "https://www.facebook.com/share/1CFQBqySuD/",
  branchName: "Friedays – Talavera Branch",
  openingTime: "09:30",
  closingTime: "19:30",
  weekdaysOnly: true
};

// Prices below are based on the supplied Friedays menu image.
// Student meal choices are not listed individually because exact items/prices
// were not provided; the known range is ₱49–₱69.
const MENU = [
  {
    id: "student-meal",
    name: "Estudyan-Tipid Meal",
    category: "Student Meals",
    price: null,
    priceLabel: "₱49–₱69",
    emoji: "🍱",
    description: "Budget-friendly student meals. Ask the branch for today's available meal choices."
  },
  {
    id: "chicken-wings",
    name: "Chicken Wings",
    category: "Chicken",
    price: 59,
    priceLabel: "₱59",
    emoji: "🍗",
    description: "Flavors: Buffalo, Honey Butter, Cheesy, and Creamy. Also available: 4 pcs ₱95 / 8 pcs ₱185."
  },
  {
    id: "wings-4pcs",
    name: "Chicken Wings — 4 pcs",
    category: "Chicken",
    price: 95,
    emoji: "🍗",
    description: "Choose Buffalo, Honey Butter, Cheesy, or Creamy."
  },
  {
    id: "wings-8pcs",
    name: "Chicken Wings — 8 pcs",
    category: "Chicken",
    price: 185,
    emoji: "🍗",
    description: "Choose Buffalo, Honey Butter, Cheesy, or Creamy."
  },
  {
    id: "boneless-chicken",
    name: "Boneless Chicken",
    category: "Chicken",
    price: 75,
    priceLabel: "₱75",
    emoji: "🍗",
    description: "Flavors: Buffalo, Honey Butter, Cheesy, and Creamy. Also available: 4 pcs ₱189 / 8 pcs ₱375."
  },
  {
    id: "boneless-4pcs",
    name: "Boneless Chicken — 4 pcs",
    category: "Chicken",
    price: 189,
    emoji: "🍗",
    description: "Choose Buffalo, Honey Butter, Cheesy, or Creamy."
  },
  {
    id: "boneless-8pcs",
    name: "Boneless Chicken — 8 pcs",
    category: "Chicken",
    price: 375,
    emoji: "🍗",
    description: "Choose Buffalo, Honey Butter, Cheesy, or Creamy."
  },
  {
    id: "nuggets-gravy",
    name: "8 pcs Nuggets w/ Gravy",
    category: "Frito Favorites",
    price: 60,
    emoji: "🍗",
    description: "Eight-piece nuggets served with gravy."
  },
  {
    id: "nuggets-fries",
    name: "8 pcs Nuggets w/ Fries",
    category: "Frito Favorites",
    price: 98,
    emoji: "🍟",
    description: "Eight-piece nuggets served with fries."
  },
  {
    id: "cheesy-chick-n-fries",
    name: "Cheesy Chick ’N Fries",
    category: "Frito Favorites",
    price: 149,
    emoji: "🍟",
    description: "A cheesy chicken-and-fries favorite."
  },
  {
    id: "cheesy-fries",
    name: "Cheesy Fries",
    category: "Snacks",
    price: 49,
    emoji: "🍟",
    description: "Cheesy fries for snack time."
  },
  {
    id: "red-iced-tea",
    name: "Red Iced Tea",
    category: "Drinks",
    price: 25,
    emoji: "🥤",
    description: "Refreshing red iced tea."
  },
  {
    id: "coke",
    name: "Coke",
    category: "Drinks",
    price: 18,
    emoji: "🥤",
    description: "₱18 per serving."
  },
  {
    id: "royal",
    name: "Royal",
    category: "Drinks",
    price: 18,
    emoji: "🥤",
    description: "₱18 per serving."
  },
  {
    id: "sprite",
    name: "Sprite",
    category: "Drinks",
    price: 18,
    emoji: "🥤",
    description: "₱18 per serving."
  },
  {
    id: "water",
    name: "Water",
    category: "Drinks",
    price: 15,
    emoji: "💧",
    description: "₱15 per serving."
  }
];

const cart = new Map();
let activeCategory = "All";

const peso = n => "₱" + Number(n).toFixed(2);
const byId = id => document.getElementById(id);

const toast = message => {
  const el = byId("toast");
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("show"), 2300);
};

function renderMenu() {
  const query = byId("menuSearch").value.trim().toLowerCase();

  const items = MENU.filter(item =>
    (activeCategory === "All" || item.category === activeCategory) &&
    (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  );

  byId("menuGrid").innerHTML = items.length
    ? items.map(item => `
      <article class="menu-card">
        <div class="menu-card-top">
          <div class="menu-emoji">${item.emoji}</div>
          <span class="menu-category">${item.category}</span>
        </div>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="menu-card-bottom">
          <div class="price">
            ${item.priceLabel || (item.price == null ? "Ask for price" : peso(item.price))}
            <small>${item.price == null ? "Price to be confirmed" : "per serving"}</small>
          </div>
          <button class="add-btn" data-add="${item.id}" aria-label="Add ${item.name} to order" title="Add to order">+</button>
        </div>
      </article>
    `).join("")
    : '<p>No menu items match that search. Try another craving.</p>';
}

function addItem(id) {
  const item = MENU.find(x => x.id === id);
  if (!item) return;

  if (item.price == null) {
    toast("Price needs branch confirmation. You can still add it to your request.");
  }

  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
}

function changeQty(id, delta) {
  const next = (cart.get(id) || 0) + delta;

  if (next <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, next);
  }

  renderCart();
}

function renderCart() {
  const entries = [...cart.entries()];
  const count = entries.reduce((s, [, q]) => s + q, 0);

  byId("cartCount").textContent = `${count} ITEM${count === 1 ? "" : "S"}`;

  byId("cartItems").innerHTML = entries.length
    ? entries.map(([id, q]) => {
        const item = MENU.find(x => x.id === id);
        const hasPrice = Number.isFinite(item.price);

        return `
          <div class="cart-row">
            <div>
              <strong>${item.name}</strong>
              <small>${hasPrice ? peso(item.price) + " each" : "Price to confirm"}</small>
            </div>
            <div class="qty-controls">
              <button data-qty="${id}" data-delta="-1" aria-label="Remove one ${item.name}">−</button>
              <b>${q}</b>
              <button data-qty="${id}" data-delta="1" aria-label="Add one ${item.name}">+</button>
            </div>
            <div class="line-total">${hasPrice ? peso(item.price * q) : "TBC"}</div>
          </div>
        `;
      }).join("")
    : '<div class="empty-cart">Your cart is waiting for something delicious. 🍟</div>';

  const knownTotal = entries.reduce((sum, [id, q]) => {
    const price = MENU.find(x => x.id === id).price;
    return sum + (Number.isFinite(price) ? price * q : 0);
  }, 0);

  const hasUnpriced = entries.some(([id]) =>
    !Number.isFinite(MENU.find(x => x.id === id).price)
  );

  byId("cartTotal").textContent =
    peso(knownTotal) + (hasUnpriced ? " + items to confirm" : "");
}

function setupPickupTimes() {
  const select = byId("pickupTime");

  for (let mins = 9 * 60 + 30; mins <= 19 * 60 + 30; mins += 30) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;

    const value =
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    const label = new Date(2000, 0, 1, h, m).toLocaleTimeString("en-PH", {
      hour: "numeric",
      minute: "2-digit"
    });

    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }
}

function orderMessage(data) {
  const lines = [
    `PRE-ORDER REQUEST — ${CONFIG.branchName}`,
    `Name: ${data.customerName}`,
    `Contact: ${data.phone}`,
    `Pickup: ${data.pickupDate} at ${data.pickupTime}`,
    "",
    "Items:"
  ];

  for (const [id, q] of cart) {
    const item = MENU.find(x => x.id === id);

    lines.push(
      `• ${q} × ${item.name} — ${
        item.price == null
          ? "price to confirm"
          : peso(item.price * q)
      }`
    );
  }

  lines.push(
    "",
    `Estimated known subtotal: ${byId("cartTotal").textContent}`,
    `Notes: ${data.notes || "None"}`,
    "",
    "Please confirm item availability, final total, and pickup schedule. Thank you!"
  );

  return lines.join("\n");
}

function openCheckout() {
  if (!cart.size) {
    toast("Add something to your craving list first!");
    return;
  }

  byId("checkout").hidden = false;
  byId("checkout").scrollIntoView({ behavior: "smooth" });

  const date = byId("pickupDate");
  const today = new Date();

  date.min = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 10);
}

byId("menuGrid").addEventListener("click", e => {
  const button = e.target.closest("[data-add]");
  if (button) addItem(button.dataset.add);
});

byId("cartItems").addEventListener("click", e => {
  const button = e.target.closest("[data-qty]");
  if (button) {
    changeQty(button.dataset.qty, Number(button.dataset.delta));
  }
});

byId("categoryTabs").addEventListener("click", e => {
  const button = e.target.closest("[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab === button);
  });

  renderMenu();
});

byId("menuSearch").addEventListener("input", renderMenu);
byId("checkoutBtn").addEventListener("click", openCheckout);

byId("closeCheckout").addEventListener("click", () => {
  byId("checkout").hidden = true;
});

document.querySelectorAll("[data-scroll]").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(button.dataset.scroll)
      .scrollIntoView({ behavior: "smooth" });
  });
});

document.querySelector("[data-filter-student]").addEventListener("click", () => {
  activeCategory = "Student Meals";

  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === activeCategory);
  });

  renderMenu();
});

byId("orderForm").addEventListener("submit", async e => {
  e.preventDefault();

  if (!cart.size) {
    toast("Your order list is empty.");
    return;
  }

  const data = Object.fromEntries(new FormData(e.currentTarget).entries());

  if (!data.pickupDate || !data.pickupTime) {
    toast("Please choose a pickup date and time.");
    return;
  }

  const chosen = new Date(data.pickupDate + "T" + data.pickupTime);
  const now = new Date();

  if (chosen < now) {
    toast("Please choose a future pickup time.");
    return;
  }

  if (
    CONFIG.weekdaysOnly &&
    [0, 6].includes(new Date(data.pickupDate + "T12:00:00").getDay())
  ) {
    toast("Friedays is listed as open Monday to Friday. Please choose a weekday.");
    return;
  }

  const [oh, om] = CONFIG.openingTime.split(":").map(Number);
  const [ch, cm] = CONFIG.closingTime.split(":").map(Number);

  const mins = chosen.getHours() * 60 + chosen.getMinutes();

  if (mins < oh * 60 + om || mins > ch * 60 + cm) {
    toast("Please choose a pickup time within branch hours.");
    return;
  }

  const message = orderMessage(data);
  const result = byId("orderResult");

  result.hidden = false;
  result.innerHTML =
    "<strong>Pre-order request prepared!</strong><br>" +
    "Your order is not confirmed yet. Send the message to Friedays and wait for the branch to confirm availability and pickup.";

  const url = CONFIG.facebookPageUrl;

  if (url) {
    const separator = url.includes("?") ? "&" : "?";
    const target = url + separator + "ref=" +
      encodeURIComponent("website-preorder");

    try {
      await navigator.clipboard.writeText(message);
    } catch (_) {}

    window.open(target, "_blank", "noopener");
    toast("Order details copied when clipboard access is available. Paste them in Messenger.");
  } else {
    try {
      await navigator.clipboard.writeText(message);

      result.innerHTML +=
        "<br><br><strong>Order text copied to clipboard.</strong> " +
        "Add the official Messenger link in app.js, then send this request to the branch.";

      toast("Order details copied. Messenger link needs setup.");
    } catch (_) {
      result.innerHTML +=
        "<br><br>Copy this order summary and send it to the branch through its official Messenger page.";

      window.prompt("Copy your pre-order request:", message);
    }
  }
});

byId("menuToggle").addEventListener("click", () => {
  const nav = byId("mainNav");
  nav.classList.toggle("open");

  byId("menuToggle").setAttribute(
    "aria-expanded",
    nav.classList.contains("open")
  );
});

document.querySelectorAll("#mainNav a").forEach(link => {
  link.addEventListener("click", () => {
    byId("mainNav").classList.remove("open");
  });
});

byId("year").textContent = new Date().getFullYear();

setupPickupTimes();
renderMenu();
renderCart();
