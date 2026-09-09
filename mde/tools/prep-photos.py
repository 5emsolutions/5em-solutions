#!/usr/bin/env python3
"""
Prepare job photos for the site.

NOT part of the website. The site itself has no build step — this is a one-off
helper you run on your own machine when new photos come in, so you are not
hand-resizing things in Preview.

What it does to each photo:
  * reads JPG, PNG, and HEIC (straight off an iPhone)
  * rotates it upright using the EXIF orientation flag, then discards that flag
  * STRIPS ALL METADATA, including GPS. Job-site photos carry the customer's
    home coordinates. Do not publish those.
  * resizes the long edge to 1600px (2000px for the hero) without upscaling
  * saves progressive JPEG, quality 82, and steps quality down until the file
    is under the size ceiling
  * writes to images/ under the name the site expects

Usage
-----
  # one photo into a known slot
  python3 tools/prep-photos.py IMG_4821.HEIC --as project-01

  # a folder of photos, named in the order given
  python3 tools/prep-photos.py porch.jpg deck.jpg kitchen.jpg \
      --as project-01 project-02 project-13

  # just clean up and resize, keep the existing names
  python3 tools/prep-photos.py ~/Desktop/mde-photos/*.jpg --out images/

Requires:  pip install pillow pillow-heif
"""

import argparse, os, sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed.  Run:  pip install pillow pillow-heif")

try:
    import pillow_heif
    pillow_heif.register_heif_opener()
except ImportError:
    pass  # HEIC support is optional; JPG and PNG still work.

# Slots that earn a bigger file because they are shown large.
BIG_SLOTS = {"project-01": 2000, "og-share": 1200}
DEFAULT_EDGE = 1600
CEILING_KB = 400


def prep(src, dest, max_edge, ceiling_kb):
    im = Image.open(src)
    im = ImageOps.exif_transpose(im)          # honour the orientation flag
    if im.mode not in ("RGB", "L"):
        im = im.convert("RGB")

    w, h = im.size
    if max(w, h) > max_edge:                  # never upscale
        scale = max_edge / float(max(w, h))
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)

    # Rebuild from raw pixels only. Nothing from the original file's metadata
    # blocks — EXIF, GPS, XMP, IPTC — survives this.
    clean = Image.frombytes(im.mode, im.size, im.tobytes())

    for q in (82, 78, 74, 70, 66, 60):
        clean.save(dest, "JPEG", quality=q, optimize=True, progressive=True)
        kb = os.path.getsize(dest) / 1024.0
        if kb <= ceiling_kb:
            break
    return im.size, kb, q


def main():
    ap = argparse.ArgumentParser(description="Resize, strip metadata and rename job photos.")
    ap.add_argument("files", nargs="+", help="source photos (JPG, PNG or HEIC)")
    ap.add_argument("--as", dest="names", nargs="*", default=None,
                    help="target slot names in order, e.g. project-01 project-02")
    ap.add_argument("--out", default="images", help="output folder (default: images)")
    ap.add_argument("--max-kb", type=int, default=CEILING_KB, help="size ceiling per file")
    a = ap.parse_args()

    if a.names and len(a.names) != len(a.files):
        sys.exit(f"Got {len(a.files)} photos but {len(a.names)} names. They have to match up.")

    os.makedirs(a.out, exist_ok=True)
    for i, src in enumerate(a.files):
        if not os.path.exists(src):
            print(f"  skip   {src}  (not found)")
            continue
        stem = a.names[i] if a.names else os.path.splitext(os.path.basename(src))[0]
        stem = stem[:-4] if stem.endswith(".jpg") else stem
        dest = os.path.join(a.out, stem + ".jpg")
        try:
            (w, h), kb, q = prep(src, dest, BIG_SLOTS.get(stem, DEFAULT_EDGE), a.max_kb)
        except Exception as e:
            print(f"  FAILED {src}: {e}")
            continue
        flag = "" if kb <= a.max_kb else "  <- still over the ceiling, check it"
        print(f"  {os.path.basename(src):28s} -> {dest:26s} {w}x{h}  {kb:5.0f} KB  q{q}{flag}")

    print("\nDone. Metadata including GPS has been stripped from every file.")


if __name__ == "__main__":
    main()
