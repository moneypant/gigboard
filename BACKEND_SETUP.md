# 🚀 GigBoard Backend Setup Guide (Supabase + PostgreSQL)

Ye guide aapko step-by-step sikhayegi ki aap **GigBoard** ko live **Supabase backend** ke sath kaise connect kar sakte hain.

---

## ⚡ Quick Summary: Abhi Kaise Kaam Kar Raha Hai?
GigBoard me humne **Hybrid Architecture** banayi hai:
1. **Bina kisi setup ke:** App turant browser me chalegi kyunki isme real Supabase SDK ke sath Local Hybrid Data layer hai (demo accounts, campus profiles, role management sab chalta hai).
2. **Supabase Connect karne ke baad:** Sirf apni 2 API keys paste karni hain, aur sara data automatically live cloud database me save hoga!

---

## 📋 Step-by-Step Supabase Connection

### Step 1: Free Supabase Account Banayein
1. [https://supabase.com](https://supabase.com) par jayein aur free sign up karein.
2. **"New Project"** par click karein.
3. Project ka naam rakhein: `gigboard`
4. Strong Database Password select karein aur Region me **South Asia (Mumbai)** choose karein (fastest for India).
5. "Create new project" par click karein (1 minute me ready ho jayega).

---

### Step 2: Database Tables & Security Create Karein (1-Click SQL)
1. Left sidebar me **SQL Editor** (`>_` icon) par click karein.
2. **"New Query"** par click karein.
3. Hamare project me bane file [`supabase-schema.sql`](supabase-schema.sql) ka saara code copy karein aur paste kar dein.
4. Niche **"Run"** button dabayein.
5. ✅ Status: *Success! Profiles, Gigs, Bookings tables, Auto-triggers aur Row Level Security (RLS) policies set ho chuki hain!*

---

### Step 3: API Keys Copy Karein
1. Left sidebar me **Project Settings** (Gear icon ⚙️) par jayein.
2. **API** tab par click karein.
3. Do cheezein copy karein:
   - **Project URL** (e.g. `https://your-project-ref.supabase.co`)
   - **Project API Keys -> `anon` / `public` key** (long token starting with `eyJhbG...`)

---

### Step 4: GigBoard me Keys Paste Karein
Ab apne project me [`js/supabase-client.js`](js/supabase-client.js) file open karein aur top lines me paste kar dein:

```javascript
const SUPABASE_CONFIG = {
  url: "https://your-project-ref.supabase.co", // Aapka Project URL
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6Ik..." // Aapka Anon Public Key
};
```

File save karte hi GigBoard live Supabase backend se connect ho jayega!

---

## 🔒 Security & Data Privacy Features Included
1. **Row Level Security (RLS):** 
   - Har user sirf apna data edit/update kar sakta hai.
   - Seller sirf apni gigs manage kar sakta hai.
   - Client sirf apni bookings dekh sakta hai.
2. **Role-Based Access Control (RBAC):**
   - Buyer aur Seller ke rights strictly separated hain.
3. **Input Sanitization & XSS Prevention:**
   - Client-side par strict HTML escaping lagayi gayi hai.
4. **PostgreSQL Triggers:**
   - Jaise hi koi new user signup karta hai, uska student profile automatically sync ho jata hai.
