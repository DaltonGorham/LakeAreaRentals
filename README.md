# Lake Area Rentals

Static marketing site for Lake Area Rentals LLC, built with React + Vite and deployed to GitHub Pages at <https://www.lakearearentalsllc.com>.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the built site locally
```

## Deploy

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds and publishes to GitHub Pages. No manual deploy step.

First-time setup: in GitHub repo **Settings → Pages**, set **Source** to **GitHub Actions**.

The custom domain (`www.lakearearentalsllc.com`) is pinned via [public/CNAME](public/CNAME) and copied into the build output automatically.

## Content

Inventory data lives in [src/data/](src/data/) (`cars.json`, `rv.json`, `sxs.json`, `trailers.json`). Images go in [public/images/](public/images/) and are referenced by absolute path (e.g. `/images/cars/foo.jpg`).
