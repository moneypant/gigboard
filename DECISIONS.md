# Decision Points

## DP1 · Rejection

**What we chose:** After a creator declines a booking, the client's My Bookings
page shows the status as **Declined**, along with the creator's optional decline
reason (e.g. "Fully booked that week"). Right below it, the client gets two
actions: **"Request again"** (goes straight back to the booking form for the
same gig, in case the date just didn't work) and **"Browse similar gigs"** (goes
to the marketplace pre-filtered to that gig's category, in case they'd rather
try a different creator).

**Why:** A decline shouldn't be a dead end. Since students are often turning down
bookings for reasons unrelated to quality — busy week, wrong date, overloaded —
we didn't want to punish the client for that or make them start over from
scratch. Showing the reason keeps it low-friction and honest; offering both
"try again" and "try someone else" respects that the client's underlying need
(the task itself) is still unmet and still worth solving on this platform.

## DP2 · Double booking

**What we chose:** Yes — a gig can hold multiple **Pending** requests at once,
even for different clients. But the moment a creator **accepts** one request for
a given date, any other Pending requests for that *same date* are automatically
declined, with the reason "This date was booked by another client first." Pending
requests for *other* dates are left untouched.

**Why:** Blocking a second Pending request outright would mean the first person
to click "Book" always wins, even if the creator would rather pick a different
client's request (better notes, better fit, etc.) — students are doing this
part-time and shouldn't be forced into a first-come-first-served queue for every
gig. Auto-resolving only at Accept time, and only for the conflicting date, keeps
the creator in control of who they work with while guaranteeing they can never
end up double-booked for the same day.

## DP3 · Discovery

**What we chose:** The marketplace defaults to a **"Featured"** sort that blends
recency with a boost for creators who haven't built up a track record yet
(gigs from creators with 0 completed bookings get the biggest boost; the boost
shrinks as their completed count grows). A visible toggle lets anyone switch to
**Newest**, **Price: Low to High**, or **Price: High to Low**.

**Why:** Pure "newest" quietly buries a great gig the moment a newer one is
posted, and pure "cheapest" turns the whole platform into a race to the bottom
on price — neither is good for students trying to get their very first booking
and build a portfolio. A light boost for brand-new creators gives everyone a
fair shot at visibility without hiding established creators, and letting the
client override the default respects that sometimes they really do just want
the cheapest or newest option.
