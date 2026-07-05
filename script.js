const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Reveal-on-scroll with per-batch stagger
const revealObserver = new IntersectionObserver(
  (entries) => {
    let batchIndex = 0;
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const delay = prefersReduced ? 0 : Math.min(batchIndex++ * 90, 450);
      entry.target.style.transitionDelay = `${delay}ms`;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Scroll progress, back-to-top visibility, and nav scroll-spy
const progressBar = document.getElementById("progress");
const toTopBtn = document.getElementById("toTop");
const sections = [...document.querySelectorAll("section[id]")];
const navLinks = [...document.querySelectorAll(".nav-links a[href^='#']")];

function onScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  toTopBtn.classList.toggle("show", window.scrollY > 600);

  let current = "";
  for (const section of sections) {
    if (window.scrollY >= section.offsetTop - 140) current = section.id;
  }
  navLinks.forEach((link) =>
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`)
  );
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

toTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" })
);

// Typewriter in the hero
const typewriterWords = [
  ".NET Core backends",
  "smart contracts in Solidity",
  "Angular & React apps",
  "cloud solutions on AWS & Azure",
  "AI-powered features",
];
const typewriterEl = document.getElementById("typewriter");
if (typewriterEl) {
  if (prefersReduced) {
    typewriterEl.textContent = typewriterWords[0];
  } else {
    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;
    (function tick() {
      const word = typewriterWords[wordIndex];
      charIndex += deleting ? -1 : 1;
      typewriterEl.textContent = word.slice(0, charIndex);
      let delay = deleting ? 40 : 75;
      if (!deleting && charIndex === word.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % typewriterWords.length;
        delay = 350;
      }
      setTimeout(tick, delay);
    })();
  }
}

// Letter-by-letter headline reveal
const heroHeading = document.querySelector(".hero h1");
if (heroHeading && !prefersReduced) {
  heroHeading.classList.add("split");
  let letterDelay = 150;
  (function splitLetters(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((chunk) => {
          if (!chunk) return;
          if (/^\s+$/.test(chunk)) {
            fragment.appendChild(document.createTextNode(" "));
            return;
          }
          const word = document.createElement("span");
          word.className = "word";
          [...chunk].forEach((char) => {
            const letter = document.createElement("span");
            letter.className = "ltr";
            letter.textContent = char;
            letter.style.animationDelay = `${letterDelay}ms`;
            letterDelay += 28;
            word.appendChild(letter);
          });
          fragment.appendChild(word);
        });
        node.replaceChild(fragment, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== "BR") {
        splitLetters(child);
      }
    });
  })(heroHeading);
}

// Interactive particle network in the hero
const netCanvas = document.getElementById("net");
if (netCanvas && !prefersReduced) {
  const ctx = netCanvas.getContext("2d");
  const hero = netCanvas.closest(".hero");
  const LINK_DIST = 110;
  const MOUSE_DIST = 170;
  const mouse = { x: null, y: null };
  let width, height, particles = [], rafId = null;

  function buildParticles() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = hero.clientWidth;
    height = hero.clientHeight;
    netCanvas.width = width * dpr;
    netCanvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(110, Math.max(35, Math.round((width * height) / 16000)));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.7 + 0.9,
      hue: Math.random() < 0.7 ? "79, 209, 197" : "124, 140, 248",
    }));
  }

  function frame() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, 0.7)`;
      ctx.fill();
    }
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(79, 209, 197, ${(1 - dist / LINK_DIST) * 0.35})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      if (mouse.x !== null) {
        const dist = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (dist < MOUSE_DIST) {
          ctx.strokeStyle = `rgba(124, 140, 248, ${(1 - dist / MOUSE_DIST) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }
    rafId = requestAnimationFrame(frame);
  }

  hero.addEventListener("mousemove", (event) => {
    const rect = hero.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
  });
  hero.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildParticles, 200);
  });

  // Only animate while the hero is on screen
  new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && rafId === null) {
        rafId = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    });
  }).observe(hero);

  buildParticles();
}

// Gentle parallax on the hero orbs
const heroSection = document.querySelector(".hero");
if (heroSection && !prefersReduced && matchMedia("(pointer: fine)").matches) {
  const orbs = [...heroSection.querySelectorAll(".orb")];
  const depths = [30, 22, 14];
  heroSection.addEventListener("mousemove", (event) => {
    const dx = event.clientX / window.innerWidth - 0.5;
    const dy = event.clientY / window.innerHeight - 0.5;
    orbs.forEach((orb, i) => {
      orb.style.translate = `${dx * depths[i]}px ${dy * depths[i]}px`;
    });
  });
}

// Count-up stats when they scroll into view
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      counterObserver.unobserve(entry.target);
      const target = parseInt(entry.target.dataset.count, 10);
      const suffix = entry.target.dataset.suffix || "";
      if (prefersReduced) {
        entry.target.textContent = target + suffix;
        return;
      }
      const start = performance.now();
      const duration = 1200;
      requestAnimationFrame(function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        entry.target.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      });
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".num[data-count]").forEach((el) => counterObserver.observe(el));

// Cursor spotlight on cards
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    card.style.setProperty("--my", `${event.clientY - rect.top}px`);
  });
});

// Skill chips filter/highlight the project cards that use them
const projectCards = [...document.querySelectorAll("#projects .card[data-skills]")];
const filterNote = document.getElementById("filter-note");
const filterLabel = filterNote?.querySelector("strong");

function clearSkillFilter() {
  projectCards.forEach((card) => card.classList.remove("dim", "match"));
  document.querySelectorAll(".chips span.on").forEach((chip) => chip.classList.remove("on"));
  if (filterNote) filterNote.hidden = true;
}

document.querySelectorAll(".chips span[data-skill]").forEach((chip) => {
  const token = chip.dataset.skill;
  const matches = projectCards.filter((card) =>
    card.dataset.skills.split(" ").includes(token)
  );
  if (!matches.length) {
    chip.removeAttribute("data-skill");
    return;
  }
  chip.setAttribute("role", "button");
  chip.setAttribute("tabindex", "0");
  const activate = () => {
    const wasOn = chip.classList.contains("on");
    clearSkillFilter();
    if (wasOn) return;
    chip.classList.add("on");
    projectCards.forEach((card) =>
      card.classList.add(matches.includes(card) ? "match" : "dim")
    );
    filterLabel.textContent = chip.textContent.trim();
    filterNote.hidden = false;
    document.getElementById("projects").scrollIntoView({
      behavior: prefersReduced ? "auto" : "smooth",
    });
  };
  chip.addEventListener("click", activate);
  chip.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      activate();
    }
  });
});

filterNote?.querySelector("button")?.addEventListener("click", clearSkillFilter);
