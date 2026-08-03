# Project images go here

Drop image files in this folder to make them show up on the site — no code
edit needed, just match the filename that's already set in
`src/data/portfolio.js`.

## Card / hero image

One file per public project, named to match its `image` field:

- `happy-present.jpg`
- `bsek-education-portal.jpg`
- `car-parking.jpg`
- `portfolio-website.jpg`
- `365-taskers.jpg`

## Gallery images (detail page only)

Each public project also has its own subfolder for its 3 gallery images:

```
happy-present/1.jpg
happy-present/2.jpg
happy-present/3.jpg

bsek-education-portal/1.jpg
bsek-education-portal/2.jpg
bsek-education-portal/3.jpg

car-parking/1.jpg
car-parking/2.jpg
car-parking/3.jpg

portfolio-website/1.jpg
portfolio-website/2.jpg
portfolio-website/3.jpg

365-taskers/1.jpg
365-taskers/2.jpg
365-taskers/3.jpg
```

NDA projects (Donatefy, Inwirement, AmeriCloud Telecom, etc.) intentionally
don't show a real image — their card shows the "Confidential" lock design
instead, so they don't need a file here.

Any common image format works (.jpg, .png, .webp). If you use a different
extension than what's in `portfolio.js`, just update that one line to match —
the field name and the actual filename need to agree, that's all.
