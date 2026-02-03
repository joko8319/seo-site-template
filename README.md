# SEO Site Template

Een Next.js template die automatisch content ophaalt uit SEO Authority Engine.

## Snelstart

### 1. Clone dit project

```bash
git clone https://github.com/jouw-username/seo-site-template mijn-nieuwe-site
cd mijn-nieuwe-site
```

### 2. Installeer dependencies

```bash
npm install
```

### 3. Configureer environment variables

Kopieer `.env.example` naar `.env.local`:

```bash
cp .env.example .env.local
```

Vul de volgende waarden in:

```env
SEO_ENGINE_API_URL=https://seo-authority-engine.vercel.app
SEO_ENGINE_API_KEY=sk_jouw_api_key_hier
SITE_NAME="Mijn Site Naam"
SITE_DESCRIPTION="Beschrijving van je site"
SITE_URL=https://jouw-domein.nl
```

Je API key vind je in SEO Authority Engine onder **Sites** → **Jouw Site** → **API Key**.

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy naar Vercel

### 1. Push naar GitHub

```bash
git add .
git commit -m "Initial commit"
git push
```

### 2. Import in Vercel

1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Import je GitHub repository
3. Voeg environment variables toe (zie stap 3 hierboven)
4. Deploy!

### 3. Domein koppelen

1. In Vercel dashboard → Settings → Domains
2. Voeg je domein toe
3. Pas DNS records aan bij je domeinprovider
4. Klaar!

## Aanpassingen

### Kleuren aanpassen

Edit `tailwind.config.ts`:

```ts
colors: {
  primary: {
    500: "#jouw-kleur",
    600: "#jouw-kleur-donkerder",
    // etc.
  },
},
```

### Logo aanpassen

Edit `src/components/Header.tsx` en `src/components/Footer.tsx`.

### Fonts aanpassen

Edit `src/app/layout.tsx` om andere Google Fonts te gebruiken.

### Pagina's toevoegen

Maak een nieuwe folder in `src/app/` met een `page.tsx` file.

## Features

- ✅ Automatische content sync met SEO Engine
- ✅ SEO geoptimaliseerd (meta tags, sitemap, robots.txt)
- ✅ Responsive design
- ✅ Snel (Next.js + caching)
- ✅ TypeScript
- ✅ Tailwind CSS

## Support

Vragen? Neem contact op via SEO Authority Engine.
