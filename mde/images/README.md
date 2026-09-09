# Images

Every photo the site expects lives in this folder. Filenames are fixed — drop a
file in with the right name and it appears on the site. No code changes.

**Format:** JPG. **Colour:** sRGB. **Quality:** 80. Keep every file under 400 KB;
a 1600px-wide JPG at quality 80 usually lands around 250 KB. Anything much
bigger and the site stops loading in under 1.5 seconds on a phone.

---

## Until the photos arrive

Every image slot that has no file shows a designed "photo coming" panel in the
site's own colours, labelled with what belongs there — not a broken-image icon.
It is automatic. Drop a file in with the right name and the panel disappears.
Nothing to switch off.

**If you want stand-in photos in the meantime**, just save any JPG into this
folder under the filename from the table below and it appears immediately.
Pexels, Unsplash and Pixabay are free for commercial use with no attribution
required; check the licence on the individual photo before using it.

Two things not to do:

- **Do not put stock photos on `projects.html`.** That page says "our own jobs"
  and "no stock photos, no other company's jobs". Another contractor's deck
  presented as MDE's work is the kind of thing a competitor screenshots. Leave
  the panels — they read as honest.
- **Do not use stock as the hero long-term.** The hero is the first thing a
  homeowner sees and a generic house photo says nothing MDE's own porch rebuild
  would not say better.

---

## 1. Photos the site is already wired for

These thirteen are the ones referenced in the brief. Until the files are here,
those spots on the site are empty.

| File | Project | Shown as | Also used on |
|---|---|---|---|
| `project-01.jpg` | Front Porch Rebuild | Finished | **Homepage hero**, social share image |
| `project-06.jpg` | Front Porch Rebuild | Framing | Homepage |
| `project-05.jpg` | Deck Build | Framing | All 10 town pages |
| `project-02.jpg` | Deck Build | Finished | Homepage |
| `project-11.jpg` | Commercial Flat Roof | Tear-off | Commercial roofing page |
| `project-10.jpg` | Commercial Flat Roof | New EPDM | Homepage, commercial roofing page |
| `project-08.jpg` | Exterior Rot and Trim | Soffit and fascia | All 10 town pages |
| `project-09.jpg` | Exterior Rot and Trim | Portico framing | — |
| `project-07.jpg` | Exterior Rot and Trim | Siding and trim | — |
| `project-12.jpg` | Interior Remodel | Subfloor | — |
| `project-13.jpg` | Interior Remodel | Drywall | All 10 town pages |
| `project-03.jpg` | Screened Porch | Structure | — |
| `project-04.jpg` | Screened Porch | Finished | — |

**Sizes.** 1600 × 1200 (4:3) is ideal. Anything from 1200px to 2000px wide is
fine. Portrait photos work — every photo sits in a fixed 4:3 frame and is
centre-cropped, so nothing breaks the layout. `project-01.jpg` is the hero, so
give that one the most room: 2000 × 1500 if you have it.

### The video screenshots

Several of these are frames pulled from video and carry black letterbox bars
plus the iOS scrubber along the bottom. **Crop those bars off in the file
itself** — do not rely on CSS to hide them.

If you cannot re-crop a file, there is a CSS escape hatch. Find that `<img>` in
`projects.html` and add `class="is-video"`:

```html
<img src="images/project-11.jpg" class="is-video" loading="lazy" ...>
```

That zooms 30% past the bars and biases upward to drop the scrubber. It costs
you resolution, so re-cropping the file is always better.

Two more optional classes if a crop lands badly: `class="bias-top"` (for tall
subjects — columns, gables) and `class="bias-bottom"`.

### Town labels

Each project on `projects.html` currently reads **EASTERN NC** because we were
never told which town each job was in. Find `<span class="town-tag">` in
`projects.html` and replace with the real town — "Rocky Mount, NC". Six edits.
Worth doing: a town on a project is a local-search signal that "Eastern NC" is not.

---

## 2. Photos still needed

Ranked by how much each one earns.

| Priority | Shot | Size | Why |
|---|---|---|---|
| **1** | **Finished painted interior**, 3–4 rooms | 1600 × 1200 | Half the company name is Paint and there is not one painting photo on the site. The Painting slot on `projects.html` is an empty placeholder right now. |
| **1** | **Finished painted exterior**, whole house | 2000 × 1500 | Same. Shoot the front elevation in flat light or the hour before sunset — midday sun blows out white trim. |
| **2** | **Matched before / after pairs** | 1600 × 1200 each | Tripod or a marked spot on the ground, same lens, same height, same time of day. Nothing sells a rot or paint job harder. Nothing on the site is labelled before/after today because none of the current photos are matched pairs. |
| **2** | **Finished flat roof** | 1600 × 1200 | `project-10.jpg` shows membrane going down. A clean finished roof — drains, edge metal, flashed curbs — is what a property manager wants to see. |
| **3** | **Crew shots, faces and branded shirts** | 1600 × 1200, plus one 1200 × 1200 | A homeowner deciding between two contractors picks the one whose people they have seen. Want: two or three on a roof or deck, one of Marshall on site. |
| **3** | **Marshall, head and shoulders** | 1200 × 1200 | For `about.html`. On site, not a studio. Save as `marshall.jpg`. |
| **4** | `og-share.jpg` | 1200 × 630 | The image that shows when the site is texted or shared on Facebook. Currently uses `project-01.jpg`, which is cropped awkwardly at that ratio. |
| **4** | `logo.png` | 512 × 512, transparent | Referenced in the business structured data. Also lets us swap the wordmark in the header for a real logo. |
| **5** | `apple-touch-icon.png` | 180 × 180 | Icon when someone saves the site to a phone home screen. The browser-tab icon is already handled by a built-in graphic — no file needed. |

### Shooting notes

- **Landscape, held horizontally.** Portrait works but crops harder.
- **Overcast is your friend** for exteriors. Harsh sun kills detail in white trim.
- **Get the whole thing in.** A tight crop of good work reads as a stock photo.
- **Shoot the framing.** Framing photos are what separate this site from every
  other contractor site in the county — they prove the work under the finish.
- **Wipe the lens.** More phone photos are ruined by a thumbprint than anything else.
- **Do not send screenshots of photos.** Send the original file.
