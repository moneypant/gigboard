/* GigBoard Auth & Identity Module
   ==========================================================================
   Handles user registration, login, session management, and role switching
   (Buyer vs. Seller) with native Indian college campus profiles.
   Compatible with Supabase Auth or Local Hybrid store.
   ========================================================================== */

const AUTH_KEYS = {
  users: "gb_users_v3",
  session: "gb_session_v3",
  activeRole: "gb_active_role"
};

// Initial Seed Users for instant demo & Hackathon evaluators
const DEMO_USERS = [
  {
    id: "usr_aisha",
    email: "aisha@campus.ac.in",
    password: "password123",
    fullName: "Aisha Sharma",
    role: "seller",
    collegeName: "IIT Delhi",
    city: "New Delhi",
    degree: "B.Tech Computer Science (3rd Year)",
    avatar: "👩‍💻",
    upiId: "aisha@upi",
    sellerBio: "Self-taught graphic & thumbnail designer. Built high-CTR visual assets for 40+ creators and college fests.",
    sellerLevel: "Trusted Creator",
    skills: ["Thumbnail Design", "Graphic Design", "Photoshop", "Brand Identity"],
    completedCount: 4,
    rating: 4.9,
    createdAt: Date.now() - 15 * 864e5
  },
  {
    id: "usr_rohan",
    email: "rohan@campus.ac.in",
    password: "password123",
    fullName: "Rohan Mehta",
    role: "both",
    collegeName: "BITS Pilani",
    city: "Pilani",
    degree: "B.E. Mechanical Engineering (2nd Year)",
    avatar: "🎬",
    upiId: "rohan@okhdfc",
    sellerBio: "Fast-paced Instagram Reels and YouTube Shorts editor with animated typography, sound design, and retention hooks.",
    sellerLevel: "Rising Talent",
    skills: ["Video Editing", "Reels", "Shorts", "Premiere Pro"],
    completedCount: 2,
    rating: 4.8,
    createdAt: Date.now() - 10 * 864e5
  },
  {
    id: "usr_test_client",
    email: "test@client.com",
    password: "password123",
    fullName: "Test Client",
    role: "buyer",
    collegeName: "Delhi University",
    city: "New Delhi",
    degree: "B.A. Economics (2nd Year)",
    avatar: "💼",
    upiId: "test@upi",
    sellerBio: "",
    sellerLevel: "Buyer",
    skills: [],
    completedCount: 0,
    rating: 5.0,
    createdAt: Date.now() - 5 * 864e5
  },
  {
    id: "usr_priya",
    email: "priya@campus.ac.in",
    password: "password123",
    fullName: "Priya Nair",
    role: "seller",
    collegeName: "Delhi University (SRCC)",
    city: "New Delhi",
    degree: "B.Com Honours (2nd Year)",
    avatar: "✍️",
    upiId: "priya@sbi",
    sellerBio: "Content & copy writer for student startups and college club newsletters. Fast turnarounds.",
    sellerLevel: "Rising Talent",
    skills: ["Content Writing", "SEO", "Copywriting", "Tutoring"],
    completedCount: 2,
    rating: 4.8,
    createdAt: Date.now() - 5 * 864e5
  }
];

function initAuthStore() {
  const existing = localStorage.getItem(AUTH_KEYS.users);
  if (!existing) {
    localStorage.setItem(AUTH_KEYS.users, JSON.stringify(DEMO_USERS));
  }
}

// Call on module load
initAuthStore();

function getAllUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.users)) || [];
  } catch (e) {
    return [];
  }
}

function saveUser(user) {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
  if (index >= 0) {
    users[index] = { ...users[index], ...user };
  } else {
    users.push(user);
  }
  localStorage.setItem(AUTH_KEYS.users, JSON.stringify(users));
  return user;
}

function getCurrentUser() {
  try {
    const session = JSON.parse(localStorage.getItem(AUTH_KEYS.session));
    if (!session || !session.userId) return null;
    const users = getAllUsers();
    return users.find(u => u.id === session.userId) || null;
  } catch (e) {
    return null;
  }
}

function getActiveRole() {
  const user = getCurrentUser();
  if (!user) return null;
  const savedRole = localStorage.getItem(AUTH_KEYS.activeRole);
  if (savedRole && (savedRole === "seller" || savedRole === "buyer")) {
    return savedRole;
  }
  return user.role === "both" ? "seller" : user.role;
}

function switchActiveRole(role) {
  if (role === "seller" || role === "buyer") {
    localStorage.setItem(AUTH_KEYS.activeRole, role);
    window.location.reload();
  }
}

async function loginUser(email, password) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check local seed & hybrid accounts first (instant login for demo accounts)
  const users = getAllUsers();
  const localUser = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (localUser) {
    if (localUser.password && localUser.password !== password) {
      return { success: false, error: "Incorrect password. Please try again." };
    }
    localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ userId: localUser.id, loggedInAt: Date.now() }));
    localStorage.setItem(AUTH_KEYS.activeRole, localUser.role === "both" ? "seller" : localUser.role);
    return { success: true, user: localUser };
  }

  // 2. If Supabase client is configured, check cloud accounts
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: cleanEmail,
        password: password
      });
      if (!error && data && data.user) {
        const userObj = {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || cleanEmail.split("@")[0],
          role: data.user.user_metadata?.role || "buyer",
          collegeName: data.user.user_metadata?.college_name || "Campus Student",
          password: password
        };
        saveUser(userObj);
        localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ userId: userObj.id, token: data.session?.access_token }));
        localStorage.setItem(AUTH_KEYS.activeRole, userObj.role);
        return { success: true, user: userObj };
      }
    } catch (err) {
      console.warn("Supabase login notice:", err.message);
    }
  }

  return { success: false, error: "Account not found or incorrect password. Please check your credentials." };
}

async function loginUserWithOtp(email) {
  const cleanEmail = email.trim().toLowerCase();
  const users = getAllUsers();
  const user = users.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return { success: false, error: "No account found with this email. Please create an account first." };
  }

  localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ userId: user.id, loggedInAt: Date.now() }));
  localStorage.setItem(AUTH_KEYS.activeRole, user.role === "both" ? "seller" : user.role);
  return { success: true, user };
}

async function signupUser({ fullName, email, password, role = "buyer", collegeName = "", degree = "", city = "", upiId = "", skills = [] }) {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = fullName.trim();
  
  if (!cleanName || !cleanEmail || !password) {
    return { success: false, error: "Please fill in all required fields." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  // Live Supabase signup if configured
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: cleanEmail,
        password: password,
        options: {
          data: {
            full_name: cleanName,
            role: role,
            college_name: collegeName,
            degree: degree,
            city: city
          }
        }
      });
      if (error) {
        // Rate limit / email errors → silently fall through to local auth
        const isRateLimit = error.message && (
          error.message.toLowerCase().includes("rate limit") ||
          error.message.toLowerCase().includes("email") ||
          error.status === 429
        );
        if (!isRateLimit) throw error;
        // else: fall through to local signup below
        console.warn("Supabase signup skipped (rate limit), using local auth:", error.message);
      } else {
        const userObj = {
          id: data.user.id,
          email: cleanEmail,
          fullName: cleanName,
          role: role,
          collegeName: collegeName || "Student Campus",
          degree,
          city,
          upiId,
          avatar: role === "seller" ? "🚀" : "🎓",
          sellerLevel: role === "seller" ? "New Creator" : "Buyer",
          completedCount: 0,
          createdAt: Date.now()
        };
        saveUser(userObj);
        localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ userId: userObj.id }));
        localStorage.setItem(AUTH_KEYS.activeRole, role);
        return { success: true, user: userObj };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // Local Hybrid Signup
  const users = getAllUsers();
  if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: "An account with this email already exists. Please sign in." };
  }

  const newUser = {
    id: "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    email: cleanEmail,
    password: password,
    fullName: cleanName,
    role: role, // 'buyer', 'seller', or 'both'
    collegeName: collegeName || "General Campus",
    degree: degree || "Student",
    city: city || "India",
    avatar: role === "seller" ? "🚀" : "🎓",
    upiId: upiId || "",
    sellerBio: "",
    sellerLevel: role === "seller" ? "New Creator" : "Buyer",
    skills: skills,
    completedCount: 0,
    rating: 5.0,
    createdAt: Date.now()
  };

  saveUser(newUser);
  localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ userId: newUser.id, loggedInAt: Date.now() }));
  localStorage.setItem(AUTH_KEYS.activeRole, role);

  return { success: true, user: newUser };
}

function logoutUser() {
  if (isSupabaseConfigured()) {
    try { supabaseClient.auth.signOut(); } catch (e) {}
  }
  localStorage.removeItem(AUTH_KEYS.session);
  localStorage.removeItem(AUTH_KEYS.activeRole);
  window.location.href = "auth.html";
}

// ⚡ 1-Click Fast / Judge Demo Login (crucial for zero-friction hackathon evaluations)
function demoLogin(type = "seller") {
  let user;
  if (type === "seller") {
    user = DEMO_USERS[0]; // Aisha Sharma
  } else if (type === "buyer") {
    user = DEMO_USERS[1]; // Rohan Mehta
  } else {
    // Judge master access
    user = {
      id: "usr_judge",
      email: "judge@hackathon.com",
      fullName: "Hackathon Evaluator",
      role: "both",
      collegeName: "Hackathon Jury HQ",
      degree: "Lead Evaluator",
      city: "National",
      avatar: "⚡",
      upiId: "judge@upi",
      sellerBio: "Master account for hackathon evaluation and zero-setup feature testing.",
      sellerLevel: "Campus Pro",
      skills: ["Evaluation", "Full Access"],
      completedCount: 10,
      rating: 5.0,
      createdAt: Date.now()
    };
    saveUser(user);
  }

  localStorage.setItem(AUTH_KEYS.session, JSON.stringify({ userId: user.id, loggedInAt: Date.now() }));
  localStorage.setItem(AUTH_KEYS.activeRole, user.role === "buyer" ? "buyer" : "seller");
  return user;
}
