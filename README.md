# Akash · Transformation Tracker

Personal fitness, diet, and skincare tracker built for the road to August 20, 2026.

## Quick Start

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Deploy to Vercel

### Option A: Push to GitHub then import on Vercel

```bash
git init
git add .
git commit -m "Initial tracker"
git branch -M main
git remote add origin https://github.com/itsakashanil/transformation-tracker.git
git push -u origin main
```

Then go to https://vercel.com/new, click "Import Git Repository", select `transformation-tracker`, accept all defaults, click Deploy.

### Option B: Direct Vercel CLI deploy

```bash
npm install -g vercel
vercel
```

Follow the prompts. First deployment links the project, subsequent `vercel --prod` deploys go straight to production.

## What's Inside

- **Today** — daily dashboard with workout, water, skin, and a rotating insight
- **Train** — full workout plan with set-by-set logging, form cues, and YouTube demo links
- **Stats** — weight chart with prediction, calendar heatmap, exercise progression, body measurements, achievements, workout history
- **Diet** — daily targets and sample meal plan
- **Skin** — morning and evening routines

## Data Storage

All data persists in browser `localStorage`. It stays on your device, never leaves. To wipe everything (start fresh) open browser console and run `localStorage.clear()`.

## Stack

- React 18 + Vite
- Tailwind CSS for styling
- Recharts for data visualisation
- Lucide for icons
