# RentVibe

**A rental and sales marketplace connecting local businesses with customers — browse curated products, pick your dates, and send a rental request in under a minute.**

🔗 **Live:** [rentvibe.vercel.app](https://rentvibe.vercel.app)

---

## The problem

Small rental shops (cameras, party gear, tools, vehicles) mostly run on phone calls and walk-ins. Customers can't see what's available, and shops lose leads they never hear about.

## The solution

A lightweight storefront plus lead pipeline:

- **Product catalogue** with category filters
- **Rental request flow** — customers pick start/end dates and leave their name and phone; each request is stored as a lead against the product
- **Admin panel** — authenticated staff curate inventory (quality-checked listings only) and work through incoming leads
- **Role-based access** — Supabase Auth + a `user_roles` table and Row Level Security keep admin actions locked down

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| UI | Tailwind CSS, shadcn/ui (Radix) |
| Data | Supabase (Postgres, Auth, RLS), TanStack Query |
| Testing | Vitest |
| Hosting | Vercel |

Data model: `products` → `leads` (rental requests), `user_roles` (admin access). See [`supabase/migrations`](./supabase/migrations).

## Run locally

```bash
npm install
# set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env
npm run dev
```

## Author

Built by [Muhammed Rinshid V P](https://github.com/muhammedrinshidvpr-coder) · [CosmIQ](https://github.com/muhammedrinshidvpr-coder)

## License

[MIT](./LICENSE)
