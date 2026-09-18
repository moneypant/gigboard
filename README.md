# gigboard

## Track
Track: Creator Gig Marketplace / Web Development

## Hackathon ID
AZIS-AQHQ37

## Project
GigBoard – India's Student Creator Marketplace for Campus Freelancers

## Tech Stack
- HTML5
- CSS3 (Custom Responsive SaaS Design System)
- JavaScript (ES6+ Vanilla)
- Supabase (PostgreSQL & Row Level Security)
- NPCI Direct UPI Integration (Dynamic QR Code & UTR Tracking)

## Features
1. **Fiverr-Style Marketplace & Search:** High-converting 3.4rem display hero, 52px integrated search bar, popular keyword chips, and campus filters (IIT Delhi, BITS Pilani, DU, IIT Bombay, VIT Vellore).
2. **3% Dynamic Platform Fee:** Automatic 3% fee calculation on all gigs with live UPI QR code generation and 12-digit UTR payment tracking.
3. **Multi-Step Creator Onboarding:** 3-step "Become a Seller" workflow with student campus verification, portfolio bio, and live gig preview.
4. **Creator Dashboard:** Real-time incoming booking requests, revenue tracker, and order status controls (Accept / Decline).
5. **Role-Based Authentication:** Direct 0ms password login with seamless switching between Buyer and Student Creator profiles.

## Differential Points (DP1, DP2, DP3)
1. **DP1 · Rejection & Smart Recovery Loop (`my-bookings.html`):** When a gig is declined with a creator's reason (e.g. exams), the client gets an instant "Request again" action that pre-fills project specs in `book.html` without retyping.
2. **DP2 · Double Booking Conflict Prevention (`dashboard.html`):** When a creator accepts a gig for a specific delivery date, all other pending requests for that same date are automatically declined with a scheduling conflict notice.
3. **DP3 · Fair Discovery Ranking (`index.html`):** Overcomes the cold-start problem by ranking newly registered student creators with 0 orders at #1 under the "Featured" sort with a `Rising Creator` badge.

## Demo Credentials
Password for all demo accounts: **`password123`**

- **Creator Account (Video Editing):** `rohan@campus.ac.in` (BITS Pilani · Tests DP2 Double Booking)
- **Creator Account (Thumbnails):** `aisha@campus.ac.in` (IIT Delhi · Tests DP3 Fair Discovery)
- **Buyer Account:** `test@client.com` (Delhi University · Tests DP1 Declined Order Recovery)

## Run Locally
No build step or installation required:

```bash
# Using Node.js
npx serve .

# Or using Python
python -m http.server 5500
