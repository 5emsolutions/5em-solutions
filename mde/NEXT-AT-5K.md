# What I'd add next, at a $5k scope

Ordered by how directly each one turns into a phone call. Everything here stays
inside the no-build-step constraint.

### 1. Call tracking and a real definition of "working" — ~$400 + $30/mo
Right now nobody can tell whether this site produced a call. A tracking number
that forwards to Marshall's cell, swapped into the page by a few lines of JS for
visitors who arrive from Google, gives you call counts, recordings, and missed
calls. Missed calls are usually the finding: most contractors lose more work to
an unanswered phone at 2pm than to anything on their website. Measure before
optimising anything else.

### 2. Photography, properly — ~$1,200
The single biggest gap. A half-day shoot across three or four live job sites:
finished painted interiors and exteriors, matched before/after pairs on a rot
job, a finished flat roof, and crew shots with faces and branded shirts. Every
one of those is listed in `images/README.md` as missing. Phone photos of good
work undersell it, and the painting side of the business currently has no visual
evidence at all.

### 3. Google Business Profile work — ~$600
The brief's second goal is ranking for the business's own name, and the GBP does
more of that than the website does. Categories set correctly (primary category
drives which searches you appear in), every service listed, photos posted weekly,
the service area drawn to match the town pages, Q&A seeded, and a written routine
for asking every finished customer for a review the same day. Reviews are the
strongest local ranking factor there is and they cost nothing but a habit.

### 4. Five to eight more town and service-intersection pages — ~$1,100
The ten town pages cover the towns. What they do not cover is the intersections
people actually type: "screened porch builder Greenville NC", "flat roof repair
Rocky Mount", "drywall repair Wilson NC". Each is a page with its own price
range and its own photos. Same structure, genuinely different copy — the ten
existing town pages are written that way and should stay that way.

### 5. Two or three project case studies — ~$700
Not a gallery entry. Eight hundred words on one job: what the homeowner called
about, what was found once it was opened up, what it cost, how long it took,
what it looks like now. This is what someone reads at 10pm when they are deciding
between three contractors, and it is the page that makes them stop comparing.

### 6. A financing or payment-plan line — ~$300
A $22,000 screened porch is a different decision from a $2,000 repair. A
contractor financing partner (Hearth, Acorn, Wisetack) and a plainly-worded page
saying what the monthly figure looks like raises the average job size more
reliably than anything on this list. Only worth doing if Marshall actually wants
larger projects.

### 7. Speed and a form-to-text bridge — ~$400
Images compressed and served as WebP with JPG fallback, the sitemap on a monthly
refresh, and a Cloudflare Worker replacing the third-party webhook — cheaper,
faster, no vendor. Most valuable piece: a form submission that texts Marshall
within seconds. Lead response time is the whole game; a lead answered in five
minutes converts several times better than the same lead answered tomorrow, and
the current promise on the success screen is "within one business day."

---

**Not worth doing at this scope:** a blog (nobody in Nash County searches their
way to a contractor through blog posts), a chat widget (it intercepts calls that
would have happened), before/after slider widgets (JavaScript weight for a thing
a side-by-side photo already does), and any redesign. The design is not what is
limiting calls — the missing photos and the unanswered phone are.
