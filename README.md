# Sandeep Chauhan — Developer Portfolio & Research Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

Personal portfolio, interactive engineering hub, and automated publishing platform built by **Sandeep Chauhan**. Blockchain developer focused on backend systems, smart contracts, and Web3 infrastructure across Starknet, Stellar, and EVM.

🌐 **Live Website:** [sandeepchauhan.vercel.app](https://sandeepchauhan.vercel.app)

---

## 💡 Key Features

### 📚 Automated Multi-Handbook Publishing Engine
A custom pre-build pipeline (`fetch-book.js`) automatically clones, parses, and syncs MDX chapters from dedicated GitHub research repositories on every build:
- **[Startup Research Handbook](https://github.com/amankoli09/startup-research-handbook)**: A 13-chapter living guide for researching real problems, customer pain points, and market gaps.
- **[The Autonomous Organization Handbook](https://github.com/amankoli09/Autonomous-Organization-Handbook)**: A multi-year research monograph investigating autonomous AI agent architectures, organizational dynamics, and governance.

### 🎨 Custom Design System & Themes
- **Interactive Dock Navigation**: macOS-style bottom dock with smooth hover effects, tooltips, and responsive layout.
- **Dynamic Accent Color Picker**: Instant theme customizer (Blue, Purple, Green, Orange, Pink, Black) backed by Zustand persistence.
- **Dark/Light Mode**: Seamless system & manual theme toggling via `next-themes`.

### 🛡️ Access Control & Security
- **Research Access Gate**: Secret passcode modal verification and IP check API for gated research handbooks.
- **Edge Runtime Verification**: Edge-compatible API routes ensuring fast validation.

### 🛠️ Open-Source & Project Showcase
- **Engineering Projects**: Interactive project cards detailing architecture, tech stack, and live GitHub repositories (*Trustless-OSS*, *Alien Protocol*, *NFXP*).
- **Open-Source Contributions**: Contribution logs across Starknet, Stellar, and EVM ecosystems.

### 🎵 Entertainment & Personal Hub
- **Spotify Integration**: Embedded player featuring current listening vibes and curated playlists.
- **Working Blockchains**: Dedicated page covering Stellar, Starknet, Ethereum, Base, and Polygon.
- **Notes & Command Palette**: Built-in developer notes widget and quick search palette (`Cmd + K`).

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Magic UI, Lucide Icons, Radix UI |
| **State Management** | Zustand (with LocalStorage persistence) |
| **Content Processing** | `@content-collections/core`, `@content-collections/mdx`, Remark GFM, Shiki |
| **Icons & Media** | Lucide React, Radix Icons, Spotify Embeds |
| **Build Pipeline** | Custom Node.js git sync script (`fetch-book.js`) |
| **Deployment** | Vercel CI/CD |

---

## 📁 Repository Structure

```
├── content/                     # MDX files compiled during prebuild
│   ├── book/                    # Startup Research Handbook chapters
│   └── agent-book/              # Autonomous Organization Handbook chapters
├── src/
│   ├── app/                     # Next.js App Router pages & API routes
│   │   ├── book/                # Handbooks overview & MDX reader routes
│   │   ├── github/              # Engineering journey & contribution stats
│   │   ├── notes/               # Personal notes widget
│   │   ├── spotify/             # Music player interface
│   │   ├── blockchains/         # Working blockchains showcase
│   │   └── api/                 # Access verification & contact endpoints
│   ├── components/              # UI components, MagicUI animations, Dock, Nav
│   ├── data/                    # Resume, project, and notes data sources
│   ├── store/                   # Zustand settings & theme state
│   └── lib/                     # Utilities & custom Markdown plugins
├── content-collections.ts       # MDX collection definitions
├── fetch-book.js                # Multi-repo GitHub sync pre-build script
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ryzen-xp/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Sync Handbooks (Optional Manual Sync):**
   ```bash
   node fetch-book.js
   ```

4. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```
   *(Runs `fetch-book.js` automatically before compiling static pages).*

---

## 🤝 Connect & Socials

- **GitHub:** [@ryzen-xp](https://github.com/ryzen-xp)
- **LinkedIn:** [Sandeep Chauhan](https://www.linkedin.com/in/ryzen-xp/)
- **Email:** [ryzen4540@gmail.com](mailto:ryzen4540@gmail.com)

---

*Designed and engineered by Sandeep Chauhan © 2026*
