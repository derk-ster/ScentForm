# ScentForm

Modern fragrance storefront — collections, concentrations, and honest product
detail. Built with Next.js (App Router), Tailwind CSS, Radix UI, Framer Motion,
and Zustand.

## Features

- Full catalog: collections, product pages, concentrations, best sellers, new arrivals, search
- Client cart with persistent state and internal `/checkout` flow (contact + shipping + payment UI, order confirmation)
- "Smells like" popular-fragrance comparisons on each product page
- Deep-zoom image lightbox with drag-to-pan, wheel zoom, and stylized close
- Scroll-triggered fade-in animations site-wide (respects `prefers-reduced-motion`)
- Two interactive quizzes: a 5-step Quick Match on the homepage and a Concentration Matcher on `/concentrations`
- Smooth scroll-to-top when clicking the `SCENTFORM` wordmark on the home page

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Script          | Purpose                           |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server              |
| `npm run build` | Production build                  |
| `npm start`     | Serve the production build        |
| `npm run lint`  | Run ESLint                        |

## Structure

```
app/             # Next.js App Router routes (pages, layouts)
components/      # UI + feature components (product, cart, home, etc.)
hooks/           # Client hooks (e.g. usePrefersReducedMotion)
lib/             # Catalog data, utilities, motion variants
store/           # Zustand cart store
types/           # Shared TypeScript types
```

## License

Proprietary — all rights reserved.
