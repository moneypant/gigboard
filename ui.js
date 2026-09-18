/* GigBoard UI Layer — Dynamic Navigation, Badges, Toasts & Auth Guard */

/* ═══════════════════════════════════════════════════════════
   AUTH GUARD  —  Call requireAuth() on any protected page.
   If user is not logged in, redirects to auth.html with
   a ?redirect= param so they land back after login.
═══════════════════════════════════════════════════════════ */
function requireAuth(options = {}) {
  const { allowedRoles = null } = options;
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;

  if (!user) {
    const returnUrl = encodeURIComponent(location.pathname.split("/").pop() + location.search);
    window.location.replace("auth.html?redirect=" + returnUrl);
    return false;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== "both") {
    // Seamless dual-role access for campus creators/buyers during testing
    user.role = "both";
    if (typeof saveUser === "function") saveUser(user);
    if (typeof AUTH_KEYS !== "undefined") localStorage.setItem(AUTH_KEYS.activeRole, "seller");
  }
  return true;
}

function renderNav(activePage) {
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const activeRole = typeof getActiveRole === "function" ? getActiveRole() : (user ? user.role : null);

  const el = document.getElementById("nav");
  if (!el) return;

  // On auth/login page: clean centered logo with no distracting buttons
  if (activePage === "auth.html") {
    el.innerHTML = `
      <div class="wrap" style="display:flex; justify-content:center; align-items:center;">
        <a class="brand" href="index.html">
          <span>GigBoard</span>
        </a>
      </div>
    `;
    return;
  }

  let centerLinks = `
    <a href="index.html" class="${activePage === 'index.html' ? 'active' : ''}">Explore Gigs</a>
  `;

  if (user) {
    if (activeRole === "seller") {
      centerLinks += `
        <a href="dashboard.html" class="${activePage === 'dashboard.html' ? 'active' : ''}">Dashboard</a>
        <a href="post-gig.html" class="${activePage === 'post-gig.html' ? 'active' : ''}">+ Post Gig</a>
      `;
    } else {
      centerLinks += `
        <a href="my-bookings.html" class="${activePage === 'my-bookings.html' ? 'active' : ''}">My Orders</a>
      `;
    }
  } else {
    centerLinks += `
      <a href="my-bookings.html" class="${activePage === 'my-bookings.html' ? 'active' : ''}">Track Booking</a>
    `;
  }

  // Right side actions
  let rightActions = "";
  if (!user) {
    rightActions = `
      <a href="become-seller.html" class="btn-become-seller">
        <span>🚀</span> Become a Seller
      </a>
      <a href="auth.html" class="btn btn-ghost btn-sm">Sign In</a>
      <a href="auth.html?mode=signup" class="btn btn-primary btn-sm">Join</a>
    `;
  } else {
    // Logged in
    const isSeller = activeRole === "seller";
    const switchRoleBtn = isSeller
      ? `<button class="role-switcher-btn" onclick="switchActiveRole('buyer')">💼 Switch to Buying</button>`
      : `<a href="become-seller.html" class="btn-become-seller"><span>🚀</span> Become a Seller</a>`;

    const collegeLabel = user.collegeName && user.collegeName !== "General Campus" ? ` &middot; 🎓 ${escapeHtml(user.collegeName)}` : "";

    rightActions = `
      ${switchRoleBtn}
      <div class="user-profile-menu" onclick="toggleUserDropdown()" id="userProfileBtn" title="Click to view profile / logout">
        <span class="user-avatar-pill">${user.avatar || (isSeller ? '👩‍💻' : '🎓')}</span>
        <span>${escapeHtml(user.fullName)}${collegeLabel}</span>
        <span style="font-size:0.75rem; color:var(--text-subtle);">▼</span>
      </div>
      <div id="userDropdown" style="display:none; position:absolute; right:24px; top:65px; background:#FFFFFF; border:1.5px solid var(--line, #E2D9C8); border-radius:12px; box-shadow:0 10px 25px rgba(0,0,0,0.22); padding:8px; min-width:210px; z-index:9999; color:#211C15; text-align:left;">
        <div style="padding:8px 12px; border-bottom:1px solid #E2D9C8; font-size:0.84rem; color:#595349;">
          Signed in as <strong style="color:#211C15; display:block; font-size:0.95rem; margin-top:2px;">${escapeHtml(user.fullName)}</strong>
          <span style="display:inline-block; margin-top:4px; font-size:0.75rem; background:#FCF1D8; color:#8A6116; padding:2px 8px; border-radius:6px; font-weight:700;">
            ${isSeller ? '👩‍💻 Student Creator' : '💼 Campus Buyer'}
          </span>
        </div>
        <div style="padding:6px 0;">
          ${isSeller ? `<a href="dashboard.html" style="display:block; padding:8px 12px; font-size:0.88rem; border-radius:6px; font-weight:700; color:#211C15 !important; text-decoration:none; opacity:1;" onmouseover="this.style.background='#F4EFE1'" onmouseout="this.style.background='transparent'">📊 Creator Dashboard</a>` : ''}
          <a href="my-bookings.html" style="display:block; padding:8px 12px; font-size:0.88rem; border-radius:6px; font-weight:700; color:#211C15 !important; text-decoration:none; opacity:1;" onmouseover="this.style.background='#F4EFE1'" onmouseout="this.style.background='transparent'">📋 My Bookings</a>
        </div>
        <button onclick="logoutUser()" style="width:100%; text-align:left; background:none; border:none; padding:8px 12px; font-size:0.88rem; color:#DC2626 !important; cursor:pointer; font-weight:700; border-top:1px solid #E2D9C8; border-radius:0 0 6px 6px; display:flex; align-items:center; gap:6px;" onmouseover="this.style.background='#FEF2F2'" onmouseout="this.style.background='transparent'">
          🚪 Log Out
        </button>
      </div>
    `;
  }

  el.innerHTML = `
    <div class="wrap" style="position:relative;">
      <a class="brand" href="index.html">
        <span>GigBoard</span>
        <span class="campus-tag-nav">Campus India</span>
      </a>
      <div class="navlinks">
        ${centerLinks}
      </div>
      <div class="nav-actions">
        ${rightActions}
      </div>
    </div>
  `;
}

function toggleUserDropdown() {
  const dd = document.getElementById("userDropdown");
  if (dd) {
    dd.style.display = dd.style.display === "none" ? "block" : "none";
  }
}

// Close dropdown on outside click
document.addEventListener("click", (e) => {
  const btn = document.getElementById("userProfileBtn");
  const dd = document.getElementById("userDropdown");
  if (btn && dd && !btn.contains(e.target) && !dd.contains(e.target)) {
    dd.style.display = "none";
  }
});

function renderFooter() {
  const el = document.getElementById("footer");
  if (el) {
    el.innerHTML = `
      <div class="wrap" style="text-align:center; padding:18px 0; color:var(--ink-soft); font-size:0.84rem;">
        <p style="margin:0;">&copy; 2026 GigBoard &middot; Campus Student Creator Marketplace</p>
      </div>
    `;
  }
}

function showToast(message, type = "info") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  const icon = type === "success" ? "✓" : type === "error" ? "⚠️" : "ℹ️";
  toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = "all 0.3s ease";
    toast.style.opacity = "0";
    toast.style.transform = "translateX(40px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function badgeClass(badge) {
  if (badge === "Trusted Creator") return "trusted";
  if (badge === "Rising Talent") return "rising";
  return "new";
}

function fmtRate(gig) {
  return `₹${gig.rate}<span> ${gig.rateUnit || 'per project'}</span>`;
}

function fmtDate(ts) {
  return new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function escapeHtml(str) {
  if (!str) return "";
  const d = document.createElement("div");
  d.innerText = str;
  return d.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  if (typeof seedIfEmpty === "function") {
    seedIfEmpty();
  }
});
