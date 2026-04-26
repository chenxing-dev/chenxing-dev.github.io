# Font Subset: CJK (Noto Serif SC)

Purpose

- Keep the repo root clean and document how to generate a small CJK subset of `Noto Serif SC`.

Quick overview

- A starter character list is provided in `font-subset-chars.txt`. Use `pyftsubset` (fonttools) to create a `.woff2` subset that includes only glyphs used on the site. Place the generated subset in `public/fonts/` and the app is already configured to preload and use `noto-serif-sc-chinese-simplified-900-normal-subset.woff2`.

Commands

1. Install fonttools:

```bash
pip install fonttools brotli
# or with pacman:
sudo pacman -S python-fonttools python-brotli
```

2. Generate subset (from repo root):

```bash
pyftsubset public/fonts/noto-serif-sc-chinese-simplified-900-normal.woff2 \
  --output-file=public/fonts/noto-serif-sc-chinese-simplified-900-normal-subset.woff2 \
  --flavor=woff2 \
  --text-file=docs/font-subset-chars.txt \
  --layout-features='*'
```
