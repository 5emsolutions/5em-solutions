# MDE Home Repair and Paint — website

Plain HTML, CSS and JavaScript. No build step, no framework, no `npm install`.
Edit a file, push it, it is live. 17 pages, largest is 30 KB.

```
index.html  services.html  projects.html  commercial-roofing.html
about.html  contact.html   reviews.html
+ 10 town pages    styles.css   script.js   sitemap.xml   robots.txt
images/     _headers
```

---

## Change the phone number

It appears in the page text, in `tel:` links, and in the structured data.
Find-and-replace across every file — two passes, both needed:

```bash
cd mde
grep -rl '(252) 904-0956' . | xargs sed -i 's/(252) 904-0956/(252) 555-1234/g'
grep -rl '+12529040956'   . | xargs sed -i 's/+12529040956/+12525551234/g'
```

The first is what people read. The second is what the phone dials. On macOS use
`sed -i ''` instead of `sed -i`. Then `grep -r '904-0956' .` should come back empty.

Same pattern for the address or hours — search for the current text, replace it.

## Prepare a photo before adding it

`tools/prep-photos.py` is a one-off helper, not a build step — the site itself
still has none. It resizes to the right dimensions, compresses under the size
ceiling, rotates phone photos upright, reads HEIC, and strips all metadata
including the GPS coordinates of the customer's house.

```bash
pip install pillow pillow-heif
python3 tools/prep-photos.py ~/Desktop/porch.HEIC --as project-01
```

Skip it if you would rather resize by hand — but do strip the location data.

## Add a gallery photo

1. Save the JPG into `images/` (see `images/README.md` for names and sizes).
2. Open `projects.html`, find the project, copy an existing `<figure class="shot">`
   block and paste it next to the others:

```html
<figure class="shot">
  <div class="shot__frame">
    <img src="images/project-14.jpg" loading="lazy" width="1000" height="750"
         alt="Describe what is actually in the photo, plainly">
  </div>
  <span class="shot__step">Finished</span>
  <figcaption>One sentence about what was done.</figcaption>
</figure>
```

That is it — mixed portrait and landscape both work, the frame crops them.
**Write real alt text.** It is what a blind visitor hears and what Google reads.

## Where the webhook lives

Top of `script.js`, line 12:

```js
var WEBHOOK_URL = "PASTE_WEBHOOK_URL_HERE";
```

Until a real URL is there the form runs in **demo mode**: it validates, shows the
success message, and sends nothing. Paste in a URL from Zapier, Make, Formspree,
or a Cloudflare Worker and it starts posting for real.

It posts `multipart/form-data` with these fields: `name`, `phone`, `email`,
`town`, `service`, `size`, `timeline`, `heard`, `details`, `photos` (0 or more
files), plus `page` and `submitted_at`. If the webhook returns anything other
than 2xx the customer is shown the phone number instead — a lead is never
silently lost.

**Test it after you set it:** submit the form on `contact.html`, confirm the row
arrives, then submit once more from a phone. Set the automation to text Marshall,
not just email him.

## Point the domain

The site is currently written for `https://mdehomerepair.com`. Change it
everywhere first — it is in the canonical tags, the sitemap and the structured data:

```bash
grep -rl 'mdehomerepair.com' . | xargs sed -i 's|https://mdehomerepair.com|https://therealdomain.com|g'
```

**Cloudflare Pages** — connect the repo, set build command to none and output
directory to `/` (or `/mde` if this folder sits inside a bigger repo). Then
Custom domains → add the domain → follow the DNS prompt.

**GitHub Pages** — Settings → Pages → deploy from branch. For a custom domain,
add a file named `CNAME` next to `index.html` containing just the bare domain,
then point a CNAME record at `<user>.github.io`.

Either way, after it is live: submit `https://yourdomain.com/sitemap.xml` in
Google Search Console, and put the domain on the Google Business Profile.

---

## Before launch — five things

1. **Verify the hours.** `HOURS_HUMAN` in the footer and `openingHoursSpecification`
   in every page's structured data are a sensible guess, not confirmed. They must
   match the Google Business Profile exactly.
2. **Set the webhook** and test it from a phone.
3. **Add the real reviews.** `reviews.html` has six marked placeholder slots and a
   copy-paste template in the HTML comments. Delete the orange "Site owner" notice
   when done.
4. **Add the town labels** to `projects.html` (see `images/README.md`).
5. **Replace the three thumbnail photos.** `project-01`, `project-02` and
   `project-13` are on the site but are only 261px wide — the hero is upscaled
   almost 4x and looks soft. Camera originals, same filenames. Remaining empty
   slots show a designed "photo coming" panel, so nothing looks broken.

Deliberately **not** on the site: no licence number (none was supplied), no email
address (none was supplied — there is a marked comment in `contact.html` showing
where it goes), and no star rating in the structured data. Inventing a review
average is the fastest way to get a Google listing suppressed; add it only from
the real numbers, as described in the comment in `reviews.html`.

## Accessibility and performance

Keep these if you edit anything: one `<h1>` per page, alt text on every image,
a `<label>` on every input, visible focus outlines, and 16px minimum on form
fields (anything smaller makes iPhones zoom on tap). No web fonts, no
third-party scripts, no cookie banner — that is why it loads fast.
