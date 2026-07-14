/* ============================================================
   marketplace.js  –  Mera Ilaka
   Beginner-friendly: every step explained with comments
   ============================================================ */

/* ── STEP 1: Sample items for sale ───────────────────────────
   Each item has: id, name, price, category, condition,
   description, seller (name + phone), and an emoji icon.
──────────────────────────────────────────────────────────── */
var items = [
  {
    id: 1,
    name:      "Samsung 32\" LED TV",
    price:     8500,
    category:  "electronics",
    condition: "Like New",
    desc:      "Barely used, 2 years old. Comes with remote and original box.",
    seller:    "Rahul Sharma",
    phone:     "98765 43210",
    icon:      "📺"
  },
  {
    id: 2,
    name:      "Wooden Study Table",
    price:     2200,
    category:  "furniture",
    condition: "Good",
    desc:      "Solid wood table with 2 drawers. Minor scratches on top but sturdy.",
    seller:    "Sunita Verma",
    phone:     "91234 56789",
    icon:      "🪑"
  },
  {
    id: 3,
    name:      "Kids School Books – Grade 5",
    price:     350,
    category:  "books",
    condition: "Good",
    desc:      "Full set of NCERT Grade 5 books. Lightly used, no torn pages.",
    seller:    "Neha Gupta",
    phone:     "77665 44332",
    icon:      "📚"
  },
  {
    id: 4,
    name:      "Men's Formal Shirts (3 pcs)",
    price:     600,
    category:  "clothing",
    condition: "Like New",
    desc:      "3 formal shirts, size M. Worn once or twice. Good brands.",
    seller:    "Arjun Reddy",
    phone:     "88776 65544",
    icon:      "👔"
  },
  {
    id: 5,
    name:      "Bicycle – Hero Ranger",
    price:     3000,
    category:  "other",
    condition: "Good",
    desc:      "21 speed mountain bike. New tyres, serviced recently. Great for daily use.",
    seller:    "Mohan Das",
    phone:     "99887 76655",
    icon:      "🚲"
  },
  {
    id: 6,
    name:      "iPhone 11 – 64GB",
    price:     22000,
    category:  "electronics",
    condition: "Good",
    desc:      "Battery health 84%. Comes with charger and back cover. No scratches on screen.",
    seller:    "Kavya Nair",
    phone:     "90001 23456",
    icon:      "📱"
  }
];

/* ── STEP 2: Run when page loads ─────────────────────────── */
window.onload = function () {
  checkLogin();
  loadNavUser();
  startClock();
  renderItems(items);
};

/* ── STEP 3: Redirect if not logged in ───────────────────── */
function checkLogin() {
  if (!sessionStorage.getItem("loggedUser")) {
    window.location.href = "login.html";
  }
}

/* ── STEP 4: Show user name in navbar ────────────────────── */
function loadNavUser() {
  var data = sessionStorage.getItem("loggedUser");
  if (!data) return;
  var user = JSON.parse(data);
  var el   = document.getElementById("navUser");
  if (el) el.textContent = "👤 " + user.name + " (" + user.role + ")";
}

/* ── STEP 5: Draw item cards on the page ─────────────────── */
function renderItems(list) {
  var grid = document.getElementById("itemsGrid");
  grid.innerHTML = "";   /* clear old cards */

  if (list.length === 0) {
    grid.innerHTML = '<div class="no-result">😕 No items found. Try a different search or filter.</div>';
    return;
  }

  /* Loop and build each card */
  list.forEach(function (item) {

    /* Format price with ₹ symbol and comma */
    var priceStr = "₹" + item.price.toLocaleString("en-IN");

    var card =
      '<div class="item-card" data-cat="' + item.category + '">'

      /* Coloured emoji banner at top */
      + '  <div class="item-img ' + item.category + '">' + item.icon + '</div>'

      /* Card body */
      + '  <div class="item-body">'
      + '    <h4>' + item.name + '</h4>'
      + '    <div class="item-desc">' + item.desc + '</div>'
      + '    <div class="item-price">' + priceStr + '</div>'

      /* Bottom row: condition badge + seller */
      + '    <div class="item-meta">'
      + '      <span class="condition-badge ' + item.condition + '">' + item.condition + '</span>'
      + '      <span class="seller-name">👤 ' + item.seller + '</span>'
      + '    </div>'
      + '  </div>'

      /* Contact button */
      + '  <button class="btn-contact" onclick="contactSeller(\'' + item.phone + '\', \'' + item.seller + '\')">'
      + '    📞 Contact Seller'
      + '  </button>'

      + '</div>';

    grid.innerHTML += card;
  });
}

/* ── STEP 6: Filter by category ──────────────────────────── */
function filterItems(category, clickedBtn) {

  /* Update highlighted button */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  clickedBtn.classList.add("active");

  /* Clear search input */
  document.getElementById("searchInput").value = "";

  var list = (category === "all")
    ? items
    : items.filter(function (i) { return i.category === category; });

  renderItems(list);
}

/* ── STEP 7: Search items by name or description ─────────── */
function searchItems() {
  var query = document.getElementById("searchInput").value.toLowerCase().trim();

  var filtered = items.filter(function (i) {
    return i.name.toLowerCase().includes(query)
        || i.desc.toLowerCase().includes(query);
  });

  /* Reset to "All" filter button when typing */
  document.querySelectorAll(".filter-btn").forEach(function (b) {
    b.classList.remove("active");
  });
  document.querySelectorAll(".filter-btn")[0].classList.add("active");

  renderItems(filtered);
}

/* ── STEP 8: Contact seller action ───────────────────────── */
function contactSeller(phone, name) {
  showToast("📞 Contacting " + name + " at " + phone);
}

/* ── STEP 9: Open "Sell Item" modal ──────────────────────── */
function openSellModal() {
  var modal = document.getElementById("sellModal");
  if (modal) modal.classList.add("open");
}

/* ── STEP 10: Close modal ────────────────────────────────── */
function closeSellModal() {
  var modal = document.getElementById("sellModal");
  if (modal) modal.classList.remove("open");
}

/* Close if user clicks dark overlay */
document.addEventListener("click", function (e) {
  var modal = document.getElementById("sellModal");
  if (modal && e.target === modal) closeSellModal();
});

/* ── STEP 11: Submit a new item for sale ─────────────────── */
function submitItem() {
  var name      = document.getElementById("itemName").value.trim();
  var price     = document.getElementById("itemPrice").value.trim();
  var contact   = document.getElementById("itemContact").value.trim();
  var category  = document.getElementById("itemCategory").value;
  var condition = document.getElementById("itemCondition").value;
  var desc      = document.getElementById("itemDesc").value.trim();

  /* Validate: all fields required */
  if (!name || !price || !contact || !desc) {
    showToast("⚠️ Please fill in all fields.");
    return;
  }

  /* Emoji icons per category */
  var icons = { electronics:"📱", furniture:"🪑", clothing:"👗", books:"📚", other:"📦" };

  /* Get seller name from session */
  var data   = sessionStorage.getItem("loggedUser");
  var seller = data ? JSON.parse(data).name : "Resident";

  /* Build new item object */
  var newItem = {
    id:        items.length + 1,
    name:      name,
    price:     parseInt(price),
    category:  category,
    condition: condition,
    desc:      desc,
    seller:    seller,
    phone:     contact,
    icon:      icons[category] || "📦"
  };

  /* Add to front of list */
  items.unshift(newItem);

  /* Clear form fields */
  ["itemName","itemPrice","itemContact","itemDesc"].forEach(function (id) {
    document.getElementById(id).value = "";
  });

  closeSellModal();
  renderItems(items);
  showToast("✅ Your item is now listed for sale!");
}

/* ── STEP 12: Toast notification ─────────────────────────── */
function showToast(msg) {
  var toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(function () { toast.classList.remove("show"); }, 3000);
}

/* ── STEP 13: Logout ─────────────────────────────────────── */
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    sessionStorage.removeItem("loggedUser");
    window.location.href = "login.html";
  }
}

/* ── STEP 14: Live clock ─────────────────────────────────── */
function startClock() {
  var el = document.getElementById("navClock");
  if (!el) return;
  function tick() {
    var now = new Date();
    var h   = String(now.getHours()).padStart(2, "0");
    var m   = String(now.getMinutes()).padStart(2, "0");
    el.textContent = "🕐 " + h + ":" + m;
  }
  tick();
  setInterval(tick, 1000);
}
