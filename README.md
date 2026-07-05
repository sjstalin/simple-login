# Smith C. D. — Portfolio

A modern, single-page developer portfolio for Smith C. D. — Software Engineer.

## ✨ Highlights

- **Animated hero**: letter-by-letter headline reveal, shimmering gradient text, interactive particle network that links to your cursor, parallax gradient orbs, and a typewriter line
- **Animated pipeline diagram**: Ideas → Code → APIs → Cloud → Products, with flowing packets (horizontal on desktop, vertical on mobile)
- **Logo in a spinning dashed ring** with a comet dot and soft glow
- **Count-up stats** and achievement badges in the hero
- **Numbered section titles** (01. About … 05. Get in touch)
- **Project cards** with hand-drawn animated SVG visuals (minting blockchain, spinning film reel, self-drawing calendar check, meshing gears), cursor-spotlight hover, and tech tags
- **Clickable skill chips** that filter/highlight the projects using that skill
- **Scroll progress bar, scroll-spy nav, staggered reveal animations, back-to-top** — all respecting `prefers-reduced-motion`
- Fully responsive, no build step — plain HTML, CSS, and vanilla JavaScript

## 🚀 Running locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 📁 Structure

```
├── index.html   # page markup + inline SVG animations
├── styles.css   # theme, layout, and animations
├── script.js    # particles, typewriter, reveals, filtering
└── Assets/      # logos and tech icons
```
