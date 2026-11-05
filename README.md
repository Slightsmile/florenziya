# Florenziya

Premium sunglasses e-commerce site for the Bangladesh-based brand Florenziya.

Single-folder project: React (Vite + Tailwind CSS v4) frontend with a Vercel
serverless API route (`api/orders.cjs`) that writes placed orders to a Google
Sheet. The API prices every order from its own server-side catalog — the
client sends only product ids and quantities, never prices.

## Local development

1. Install dependencies:
   ```
   npm install
   ```
2. Install the Vercel CLI once, globally, if you don't have it:
   ```
   npm install -g vercel
   ```
3. Copy `.env.example` to `.env` and fill in your Google service account
   credentials (see "Google Sheets setup" below).
4. Run the app (serves the React frontend and the `/api/orders` function
   together, same as production):
   ```
   npm run dev
   ```

## Google Sheets setup

Orders are saved to a Google Sheet instead of a local Excel file, so order
data survives serverless deployments and multiple customers can order at the
same time without conflicts.

1. Go to the [Google Cloud Console](https://console.cloud.google.com/) and
   create a new project (or use an existing one).
2. Enable the **Google Sheets API** for that project.
3. Create a **Service Account** (IAM & Admin → Service Accounts), then
   create a JSON key for it and download it.
4. Create a new Google Sheet. Add a tab named exactly `Orders`.
5. Share that Google Sheet with the service account's email address (found
   in the JSON key, looks like
   `something@your-project.iam.gserviceaccount.com`), giving it **Editor**
   access.
6. Copy the Sheet ID from its URL:
   `https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit`
7. Set these as environment variables (locally in `.env`, and in your
   Vercel project settings for production):
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — the service account's email
   - `GOOGLE_PRIVATE_KEY` — the `private_key` field from the JSON key
     (keep the `\n` characters as literal `\n` in the env var value)
   - `GOOGLE_SHEET_ID` — the Sheet ID from step 6

## Deploying to Vercel

1. Push this project to a GitHub repo (or run `vercel` from this folder
   directly).
2. Import the project in [Vercel](https://vercel.com/new).
3. Add the three environment variables above in the Vercel project
   settings (Settings → Environment Variables).
4. Deploy. Vercel will build the frontend and automatically detect
   `api/orders.cjs` as a serverless function at `/api/orders`.

> After deploying, run `node scripts/test-orders.cjs` to smoke-test the API
> (needs no Google credentials — googleapis is stubbed).

## Project structure

```
├── api/
│   └── orders.cjs       # Vercel serverless function — validates & saves orders
├── public/
│   ├── logo.png, logo-full.png, logo-text.png
│   └── products/        # product photos
├── src/
│   ├── components/      # Header, Hero, ProductCard, ProductGrid, Footer
│   ├── context/          # CartContext (cart state, persisted to localStorage)
│   ├── data/              # products.js — product catalog
│   ├── pages/             # Home, Cart, Checkout, OrderSuccess
│   ├── App.jsx
│   └── main.jsx
├── vercel.json
└── vite.config.js
```
