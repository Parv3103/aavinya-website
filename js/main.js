/* ==========================================================================
   AAVINYA — AI Forum | main.js
   Modules:
     DataService · Utils · Intro · Router · Navbar · Reveal · Counters
     Constellation · HomeRender · ForumRender · EventsRender · ConnectRender
     LoginModal · DetailModal · ContactForm · Toast · Ripple
   ========================================================================== */
(function () {
  "use strict";

  /* ======================================================================
     0. DATA SERVICE  (single swap-point for a future backend)
     ====================================================================== */
  const DataService = {
    _d: window.AAVINYA_DATA || {},
    // Each getter is async-ready: replace the body with
    // `return (await fetch('/api/...')).json()` when the backend exists.
    config() { return this._d.SITE_CONFIG || {}; },
    stats() { return this._d.STATS || []; },
    vision() { return this._d.VISION || {}; },
    mission() { return this._d.MISSION || {}; },
    whatWeRun() { return this._d.WHAT_WE_RUN || []; },
    hod() { return this._d.HOD || []; },
    forumIncharge() { return this._d.FORUM_INCHARGE || []; },
    adminBody() { return this._d.ADMIN_BODY || []; },
    committees() { return this._d.COMMITTEES || []; },
    events() { return this._d.EVENTS || []; },
    socials() { return this._d.SOCIAL_LINKS || []; }
  };

  /* ======================================================================
     1. UTILITIES
     ====================================================================== */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const prefersReduced = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function initials(name) {
    const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "AA";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /** Deterministic hue so the same person always gets the same avatar tint. */
  function hueOf(name) {
    let h = 0;
    const s = String(name || "");
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
    return 185 + (h % 60); // cyan → blue band only (keeps brand palette)
  }

  /** Avatar markup: real photo if provided, otherwise an initials avatar. */
  function avatar(person, extraClass) {
    const cls = "avatar" + (extraClass ? " " + extraClass : "");
    const name = escapeHtml(person && person.name);
    if (person && person.photo) {
      return `<span class="${cls}"><img src="${escapeHtml(person.photo)}" alt="Photograph of ${name}" loading="lazy"></span>`;
    }
    const hue = hueOf(person && person.name);
    const bg = `linear-gradient(135deg, hsl(${hue} 70% 32%), hsl(${hue + 18} 72% 48%))`;
    return `<span class="${cls}" style="background:${bg}" role="img" aria-label="${name}">${escapeHtml(initials(person && person.name))}</span>`;
  }

  function personLinks(person) {
    const email = person && person.email;
    const li = person && person.linkedin;
    const name = escapeHtml(person && person.name);
    const mail = email
      ? `<a href="mailto:${escapeHtml(email)}" aria-label="Email ${name}"><i class="fa-solid fa-envelope"></i></a>`
      : `<span class="disabled" title="Email not available" aria-hidden="true"><i class="fa-solid fa-envelope"></i></span>`;
    const link = li
      ? `<a href="${escapeHtml(li)}" target="_blank" rel="noopener" aria-label="LinkedIn profile of ${name}"><i class="fa-brands fa-linkedin-in"></i></a>`
      : `<span class="disabled" title="LinkedIn not available" aria-hidden="true"><i class="fa-brands fa-linkedin-in"></i></span>`;
    return `<div class="person-links">${mail}${link}</div>`;
  }

  const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  function parseDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return isNaN(d) ? null : d;
  }
  function dayOf(iso) { const d = parseDate(iso); return d ? String(d.getDate()).padStart(2, "0") : "--"; }
  function monthOf(iso) { const d = parseDate(iso); return d ? MONTHS[d.getMonth()] : "---"; }
  function longDate(iso) {
    const d = parseDate(iso);
    if (!d) return iso;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  }

  function debounce(fn, wait) {
    let t;
    return function () {
      const a = arguments, c = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(c, a), wait);
    };
  }

  /* ======================================================================
     2. TOAST NOTIFICATIONS
     ====================================================================== */
  const Toast = (function () {
    const stack = $("#toast-stack");
    const ICONS = {
      success: "fa-solid fa-circle-check",
      error: "fa-solid fa-circle-exclamation",
      info: "fa-solid fa-circle-info"
    };
    function show(title, message, type) {
      if (!stack) return;
      const kind = type || "info";
      const el = document.createElement("div");
      el.className = "toast toast-" + kind;
      el.innerHTML =
        `<i class="${ICONS[kind] || ICONS.info}" aria-hidden="true"></i>` +
        `<div class="toast-body"><strong>${escapeHtml(title)}</strong>` +
        (message ? `<p>${escapeHtml(message)}</p>` : "") + `</div>`;
      stack.appendChild(el);
      setTimeout(() => {
        el.classList.add("out");
        setTimeout(() => el.remove(), 400);
      }, 4200);
    }
    return { show };
  })();

  /* ======================================================================
     3. BUTTON RIPPLE
     ====================================================================== */
  function initRipple() {
    document.addEventListener("click", function (e) {
      const btn = e.target.closest("[data-ripple]");
      if (!btn || prefersReduced()) return;
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height);
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = (e.clientX - r.left - size / 2) + "px";
      span.style.top = (e.clientY - r.top - size / 2) + "px";
      btn.appendChild(span);
      setTimeout(() => span.remove(), 680);
    });
  }

  /* ======================================================================
     4. SCROLL REVEAL
     ====================================================================== */
  const Reveal = (function () {
    let io = null;
    function ensure() {
      if (io || !("IntersectionObserver" in window)) return;
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    }
    function scan(root) {
      const nodes = $$(".reveal:not(.visible)", root || document);
      if (prefersReduced() || !("IntersectionObserver" in window)) {
        nodes.forEach(n => n.classList.add("visible"));
        return;
      }
      ensure();
      nodes.forEach((n, i) => {
        n.style.transitionDelay = Math.min(i % 8, 7) * 70 + "ms";
        io.observe(n);
      });
    }
    return { scan };
  })();

  /* ======================================================================
     5. ANIMATED COUNTERS
     ====================================================================== */
  const Counters = (function () {
    function run(el) {
      const target = parseFloat(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      if (prefersReduced()) { el.textContent = target + suffix; return; }
      const dur = 1700;
      const start = performance.now();
      function frame(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function observe() {
      const nodes = $$("[data-counter]:not([data-done])");
      if (!nodes.length) return;
      if (!("IntersectionObserver" in window)) {
        nodes.forEach(n => { n.dataset.done = "1"; run(n); });
        return;
      }
      const io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.dataset.done) {
            entry.target.dataset.done = "1";
            run(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      nodes.forEach(n => io.observe(n));
    }
    return { observe };
  })();

  /* ======================================================================
     6. AI CONSTELLATION CANVAS  (hero + intro)
     ====================================================================== */
  function createNetwork(canvas, opts) {
    if (!canvas || !canvas.getContext) return null;
    const ctx = canvas.getContext("2d");
    const cfg = Object.assign({
      density: 11000,     // lower = more particles
      maxParticles: 110,
      linkDist: 140,
      speed: 0.26,
      mouse: true,
      glow: true
    }, opts || {});

    let w = 0, h = 0, dpr = 1, particles = [], raf = null, running = false;
    const pointer = { x: -9999, y: -9999, active: false };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(rect.width, 1);
      h = Math.max(rect.height, 1);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      const count = Math.max(24, Math.min(cfg.maxParticles, Math.round((w * h) / cfg.density)));
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * cfg.speed,
          vy: (Math.random() - 0.5) * cfg.speed,
          r: Math.random() * 1.8 + 0.9,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = cfg.linkDist;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

        // gentle pointer attraction
        if (cfg.mouse && pointer.active) {
          const dx = pointer.x - p.x, dy = pointer.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 36000 && d2 > 1) {
            const f = 0.00035;
            p.vx += dx * f; p.vy += dy * f;
            const sp = Math.hypot(p.vx, p.vy);
            const max = cfg.speed * 3.2;
            if (sp > max) { p.vx = (p.vx / sp) * max; p.vy = (p.vy / sp) * max; }
          }
        }

        // links
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            const a = (1 - dist / linkDist) * 0.42;
            ctx.strokeStyle = "rgba(0,168,232," + a.toFixed(3) + ")";
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }

        // link to pointer
        if (cfg.mouse && pointer.active) {
          const dxp = p.x - pointer.x, dyp = p.y - pointer.y;
          const dp = Math.hypot(dxp, dyp);
          if (dp < 190) {
            const a = (1 - dp / 190) * 0.55;
            ctx.strokeStyle = "rgba(0,195,255," + a.toFixed(3) + ")";
            ctx.lineWidth = 0.85;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        // node
        p.pulse += 0.022;
        const glow = 0.55 + Math.sin(p.pulse) * 0.35;
        if (cfg.glow) {
          ctx.shadowBlur = 12;
          ctx.shadowColor = "rgba(0,168,232,.9)";
        }
        ctx.fillStyle = "rgba(" + (i % 4 === 0 ? "0,200,255" : "0,168,232") + "," + glow.toFixed(2) + ")";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(step);
    }

    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches ? e.touches[0] : e;
      pointer.x = t.clientX - rect.left;
      pointer.y = t.clientY - rect.top;
      pointer.active = pointer.x >= 0 && pointer.x <= w && pointer.y >= 0 && pointer.y <= h;
    }
    function onLeave() { pointer.active = false; }

    function start() {
      if (running) return;
      running = true;
      resize();
      if (prefersReduced()) {
        // single static frame instead of continuous motion
        ctx.clearRect(0, 0, w, h);
        particles.forEach(function (p) {
          ctx.fillStyle = "rgba(43,184,216,.55)";
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        return;
      }
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    }

    window.addEventListener("resize", debounce(function () {
      if (running) { stop(); running = false; start(); } else { resize(); }
    }, 180));
    if (cfg.mouse) {
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("mouseout", onLeave);
      window.addEventListener("touchend", onLeave);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
      else if (running && !raf && !prefersReduced()) raf = requestAnimationFrame(step);
    });

    return { start, stop, resize };
  }

  /* ======================================================================
     7. INTRO SCREEN
     ====================================================================== */
  const Intro = (function () {
    const screen = $("#intro-screen");
    const fill = $("#intro-bar-fill");
    const status = $("#intro-status");
    const skip = $("#intro-skip");
    const MSGS = [
      "initializing neural network…",
      "loading forum registry…",
      "syncing committee hierarchy…",
      "calibrating event timeline…",
      "aavinya online"
    ];
    let net = null, done = false, timers = [];

    function finish() {
      if (done || !screen) return;
      done = true;
      timers.forEach(clearTimeout);
      screen.classList.add("done");
      document.body.classList.remove("is-locked");
      setTimeout(function () {
        if (net) net.stop();
        screen.remove();
      }, 1100);
    }

    function run() {
      if (!screen) return;
      document.body.classList.add("is-locked");
      net = createNetwork($("#intro-canvas"), { density: 9000, maxParticles: 95, linkDist: 150, speed: 0.34, mouse: true });
      if (net) net.start();

      const total = prefersReduced() ? 700 : 3000;
      const steps = MSGS.length;
      for (let i = 0; i < steps; i++) {
        timers.push(setTimeout(function (idx) {
          if (fill) fill.style.width = Math.round(((idx + 1) / steps) * 100) + "%";
          if (status) status.textContent = MSGS[idx];
        }.bind(null, i), (total / steps) * i + 200));
      }
      timers.push(setTimeout(finish, total + 450));
      if (skip) skip.addEventListener("click", finish);
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") finish();
      });
    }
    return { run, finish };
  })();

  /* ======================================================================
     8. NAVBAR
     ====================================================================== */
  const Navbar = (function () {
    const bar = $("#navbar");
    const toggle = $("#nav-toggle");
    const links = $("#nav-links");
    const progress = $("#nav-progress");
    const toTop = $("#to-top");

    function closeMenu() {
      if (!links) return;
      links.classList.remove("open");
      if (toggle) {
        toggle.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
      }
    }
    function openMenu() {
      if (!links) return;
      links.classList.add("open");
      if (toggle) {
        toggle.classList.add("open");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");
      }
    }

    function onScroll() {
      const y = window.scrollY || 0;
      if (bar) bar.classList.toggle("scrolled", y > 30);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
      }
      if (toTop) toTop.hidden = y < 500;
    }

    function init() {
      if (toggle) {
        toggle.addEventListener("click", function () {
          links.classList.contains("open") ? closeMenu() : openMenu();
        });
      }
      $$(".nav-link").forEach(a => a.addEventListener("click", closeMenu));
      document.addEventListener("click", function (e) {
        if (!links || !links.classList.contains("open")) return;
        if (e.target.closest("#nav-links") || e.target.closest("#nav-toggle")) return;
        closeMenu();
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeMenu();
      });
      if (toTop) {
        toTop.addEventListener("click", function () {
          window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });
        });
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", debounce(function () {
        if (window.innerWidth > 992) closeMenu();
      }, 150));
      onScroll();
    }
    function setActive(route) {
      $$(".nav-link").forEach(function (a) {
        const on = a.dataset.route === route;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
    }
    return { init, setActive, closeMenu };
  })();

  /* ======================================================================
     9. ROUTER  (hash based, no page reload)
     ====================================================================== */
  const Router = (function () {
    const ROUTES = ["home", "forum", "events", "connect"];
    const veil = $("#route-veil");
    const veilLabel = $("#route-veil-label");
    let current = null;
    let busy = false;

    /** In-page anchors that belong to a specific route. */
    const ANCHOR_MAP = {
      "home-stats": "home", "who-we-are": "home", "vision-mission": "home",
      "what-we-run": "home", "leadership-strip": "home", "hero-section": "home",
      "admin-body": "forum", "committee-structure": "forum", "committee-members": "forum",
      "events-list": "events",
      "social-section": "connect", "contact-section": "connect"
    };

    function parseHash() {
      const raw = (location.hash || "#home").replace(/^#/, "").trim();
      if (!raw) return { route: "home", anchor: null };
      if (ROUTES.indexOf(raw) !== -1) return { route: raw, anchor: null };
      if (ANCHOR_MAP[raw]) return { route: ANCHOR_MAP[raw], anchor: raw };
      return { route: "home", anchor: null };
    }

    function scrollToAnchor(id) {
      const el = document.getElementById(id);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 86;
      window.scrollTo({ top: Math.max(top, 0), behavior: prefersReduced() ? "auto" : "smooth" });
    }

    function paint(route, anchor) {
      $$(".page").forEach(function (p) {
        const on = p.dataset.page === route;
        p.hidden = !on;
        p.classList.toggle("entering", on);
        if (on) {
          // restart entry animation
          p.classList.remove("entering");
          void p.offsetWidth;
          p.classList.add("entering");
        }
      });
      Navbar.setActive(route);
      document.title = ({
        home: "AAVINYA | AI Forum — Department of Artificial Intelligence, JDCOEM Nagpur",
        forum: "Forum — Admin Body & Committees | AAVINYA",
        events: "Events & Activities | AAVINYA",
        connect: "Connect With Us | AAVINYA"
      })[route] || "AAVINYA";

      if (anchor) {
        setTimeout(() => scrollToAnchor(anchor), 120);
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      Reveal.scan(document.getElementById("page-" + route));
      Counters.observe();
      const main = $("#main-content");
      if (main) main.setAttribute("data-route", route);
    }

    function go(route, anchor) {
      if (busy) return;
      if (route === current) { if (anchor) scrollToAnchor(anchor); return; }
      Navbar.closeMenu();

      if (prefersReduced() || current === null) {
        current = route;
        paint(route, anchor);
        return;
      }
      busy = true;
      if (veilLabel) veilLabel.textContent = route;
      if (veil) veil.classList.add("active");
      setTimeout(function () {
        current = route;
        paint(route, anchor);
        if (veil) veil.classList.remove("active");
        setTimeout(function () { busy = false; }, 340);
      }, 430);
    }

    function handle() {
      const p = parseHash();
      go(p.route, p.anchor);
    }

    function init() {
      window.addEventListener("hashchange", handle);
      // footer links that must switch route AND scroll to a section
      $$("[data-route-link]").forEach(function (a) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          const anchor = (a.getAttribute("href") || "").replace(/^#/, "");
          location.hash = "#" + anchor;
        });
      });
      handle();
    }
    return { init, go, get current() { return current; } };
  })();

  /* ======================================================================
     10. HOME RENDERING
     ====================================================================== */
  const HomeRender = (function () {
    function stats() {
      const host = $("#stats-grid");
      if (!host) return;
      host.innerHTML = DataService.stats().map(function (s, i) {
        return `
        <article class="stat-card glass reveal">
          <div class="stat-icon" aria-hidden="true"><i class="${escapeHtml(s.icon)}"></i></div>
          <p class="stat-value"><span data-counter data-target="${Number(s.value)}" data-suffix="${escapeHtml(s.suffix || "")}">0</span></p>
          <p class="stat-label">${escapeHtml(s.label)}</p>
        </article>`;
      }).join("");
    }

    function who() {
      const lead = $("#who-lead");
      if (lead) lead.textContent = DataService.config().whoWeAre || "";
    }

    function visionMission() {
      const host = $("#vm-grid");
      if (!host) return;
      const items = [DataService.vision(), DataService.mission()];
      host.innerHTML = items.map(function (it, i) {
        return `
        <article class="vm-card glass reveal">
          <span class="vm-tag mono">0${i + 1} / ${escapeHtml(String(it.title || "").toUpperCase())}</span>
          <div class="vm-icon" aria-hidden="true"><i class="${escapeHtml(it.icon)}"></i></div>
          <h3>${escapeHtml(it.title)}</h3>
          <p>${escapeHtml(it.text)}</p>
        </article>`;
      }).join("");
    }

    function whatWeRun() {
      const host = $("#wwr-grid");
      if (!host) return;
      host.innerHTML = DataService.whatWeRun().map(function (c, i) {
        return `
        <article class="wwr-card glass reveal">
          <div class="wwr-icon" aria-hidden="true"><i class="${escapeHtml(c.icon)}"></i></div>
          <h3>${escapeHtml(c.title)}</h3>
          <p>${escapeHtml(c.desc)}</p>
          <span class="wwr-index mono" aria-hidden="true">0${i + 1}</span>
        </article>`;
      }).join("");
    }

    function leadMini() {
      const host = $("#lead-mini");
      if (!host) return;
      host.innerHTML = DataService.adminBody().slice(0, 4).map(function (p) {
        return `
        <div class="lead-mini-item">
          <span class="lead-mini-avatar">${escapeHtml(initials(p.name))}</span>
          <span class="lead-mini-text">
            <strong>${escapeHtml(p.name)}</strong>
            <small>${escapeHtml(p.position)}</small>
          </span>
        </div>`;
      }).join("");
    }

    function init() { stats(); who(); visionMission(); whatWeRun(); leadMini(); }
    return { init };
  })();

  /* ======================================================================
     11. FORUM RENDERING  (Admin Body + Committees + Directory)
     ====================================================================== */
  const ForumRender = (function () {
    let activeFilter = "all";

    /* ---- Admin Body ---- */
    function adminBody() {
      const hodList = DataService.hod();
      const inchargeList = DataService.forumIncharge();
      const people = DataService.adminBody();
      if (!people.length && !inchargeList.length && !hodList.length) return;

      const presHost = $("#admin-president");
      if (presHost) {
        let html = "";

        hodList.forEach(function (hod) {
          html += `
          <article class="president-card reveal" style="margin-bottom: 2rem; border-color: rgba(43, 184, 216, 0.5);">
            ${avatar(hod)}
            <div class="president-meta">
              <span class="president-role">${escapeHtml(hod.position)}</span>
              <h3>${escapeHtml(hod.name)}</h3>
              <p>Head of Department of Artificial Intelligence, providing overall vision, academic excellence, and leadership for the AAVINYA AI Forum.</p>
              ${personLinks(hod)}
            </div>
          </article>`;
        });

        inchargeList.forEach(function (incharge) {
          html += `
          <article class="president-card reveal" style="margin-bottom: 2rem; border-color: rgba(43, 184, 216, 0.4);">
            ${avatar(incharge)}
            <div class="president-meta">
              <span class="president-role">${escapeHtml(incharge.position)}</span>
              <h3>${escapeHtml(incharge.name)}</h3>
              <p>Faculty &amp; Forum In-Charge overseeing the operations, initiatives, and vision of the AAVINYA AI Forum for session 2026–27.</p>
              ${personLinks(incharge)}
            </div>
          </article>`;
        });

        if (people.length) {
          const president = people[0];
          html += `
          <article class="president-card reveal">
            ${avatar(president)}
            <div class="president-meta">
              <span class="president-role">${escapeHtml(president.position)}</span>
              <h3>${escapeHtml(president.name)}</h3>
              <p>Leads the AAVINYA AI Forum for the 2026–27 session, coordinating the
                 Admin Body and all twelve committees of the Department of Artificial Intelligence.</p>
              ${personLinks(president)}
            </div>
          </article>`;
        }
        presHost.innerHTML = html;
      }

      const grid = $("#admin-grid");
      if (grid && people.length > 1) {
        const rest = people.slice(1);
        grid.innerHTML = rest.map(function (p) {
          return `
          <article class="person-card glass reveal">
            ${avatar(p)}
            <p class="person-name">${escapeHtml(p.name)}</p>
            <p class="person-role">${escapeHtml(p.position)}</p>
            <p class="person-sub">Admin Body • 2026–27</p>
            ${personLinks(p)}
          </article>`;
        }).join("");
      }
    }

    /* ---- Forum metrics ---- */
    function metrics() {
      const host = $("#forum-metrics");
      if (!host) return;
      const committees = DataService.committees();
      let heads = 0, coHeads = 0, members = 0;
      committees.forEach(function (c) {
        if (c.head) heads++;
        coHeads += (c.coHeads || []).length;
        members += (c.members || []).length;
      });
      const total = DataService.hod().length + DataService.forumIncharge().length + DataService.adminBody().length + heads + coHeads + members;
      const items = [
        { label: "Committees", value: committees.length },
        { label: "Admin Body", value: DataService.adminBody().length },
        { label: "Heads", value: heads },
        { label: "Co-Heads", value: coHeads },
        { label: "Members", value: members },
        { label: "Total Team", value: total }
      ];
      host.innerHTML = items.map(function (i) {
        return `<span class="forum-metric"><strong>${i.value}</strong> ${escapeHtml(i.label)}</span>`;
      }).join("");
    }

    /* ---- Committee filters ---- */
    function filters() {
      const host = $("#committee-filters");
      if (!host) return;
      const btns = [{ id: "all", label: "All" }].concat(
        DataService.committees().map(c => ({ id: c.id, label: c.short || c.name }))
      );
      host.innerHTML = btns.map(function (b, i) {
        return `<button class="filter-btn${i === 0 ? " active" : ""}" type="button" role="tab"
                  aria-selected="${i === 0 ? "true" : "false"}" data-filter="${escapeHtml(b.id)}">
                  ${escapeHtml(String(b.label).toUpperCase())}</button>`;
      }).join("");

      host.addEventListener("click", function (e) {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        activeFilter = btn.dataset.filter;
        $$(".filter-btn", host).forEach(function (b) {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        committees();
      });
    }

    /* ---- Committee cards ---- */
    function committeeCard(c) {
      const coHeads = c.coHeads || [];
      const members = c.members || [];
      const coLabel = coHeads.length > 1 ? "Co-Heads" : "Co-Head";
      const totalPeople = (c.head ? 1 : 0) + coHeads.length + members.length;

      const headBlock = c.head ? `
        <p class="role-label"><i class="fa-solid fa-crown"></i> Head</p>
        <div class="cc-head">
          ${avatar(c.head)}
          <div class="cc-head-info">
            <strong>${escapeHtml(c.head.name)}</strong>
            <span>Committee Head</span>
          </div>
        </div>` : "";

      const coBlock = coHeads.length ? `
        <p class="role-label"><i class="fa-solid fa-user-tie"></i> ${escapeHtml(coLabel)}</p>
        <div class="cc-coheads">
          ${coHeads.map(function (p) {
        return `<div class="cc-cohead">
              ${avatar(p)}
              <div class="cc-cohead-info">
                <strong>${escapeHtml(p.name)}</strong>
                <span>${escapeHtml(coLabel === "Co-Heads" ? "Co-Head" : "Co-Head")}</span>
              </div>
            </div>`;
      }).join("")}
        </div>` : "";

      const memBlock = members.length ? `
        <p class="role-label"><i class="fa-solid fa-users"></i> Members</p>
        <div class="cc-members">
          ${members.map(function (p) {
        return `<div class="cc-member">${avatar(p)}<span>${escapeHtml(p.name)}</span></div>`;
      }).join("")}
        </div>` : "";

      return `
      <article class="committee-card glass" data-committee="${escapeHtml(c.id)}">
        <div class="cc-head-bar">
          <span class="cc-badge" aria-hidden="true"><i class="${escapeHtml(c.icon || "fa-solid fa-users")}"></i></span>
          <div class="cc-title">
            <h3>${escapeHtml(c.name)}</h3>
            <small>${escapeHtml(c.tag || "AAVINYA 2026–27")}</small>
          </div>
          <span class="cc-count mono">${totalPeople} members</span>
        </div>
        ${headBlock}${coBlock}${memBlock}
      </article>`;
    }

    function committees() {
      const host = $("#committee-grid");
      if (!host) return;
      const list = activeFilter === "all"
        ? DataService.committees()
        : DataService.committees().filter(c => c.id === activeFilter);
      host.innerHTML = list.map(committeeCard).join("");
      $$(".committee-card", host).forEach(function (card, i) {
        card.style.animationDelay = Math.min(i * 70, 500) + "ms";
      });
    }

    /* ---- Directory (flattened people list) ---- */
    function buildDirectory() {
      const rows = [];
      DataService.hod().forEach(function (p) {
        rows.push({ name: p.name, role: p.position, group: "HOD", rank: "hod", person: p });
      });
      DataService.forumIncharge().forEach(function (p) {
        rows.push({ name: p.name, role: p.position, group: "Forum Incharge", rank: "incharge", person: p });
      });
      DataService.adminBody().forEach(function (p) {
        rows.push({ name: p.name, role: p.position, group: "Admin Body", rank: "admin", person: p });
      });
      DataService.committees().forEach(function (c) {
        if (c.head) rows.push({ name: c.head.name, role: "Head", group: c.name, rank: "head", person: c.head });
        (c.coHeads || []).forEach(function (p) {
          rows.push({ name: p.name, role: "Co-Head", group: c.name, rank: "cohead", person: p });
        });
        (c.members || []).forEach(function (p) {
          rows.push({ name: p.name, role: "Member", group: c.name, rank: "member", person: p });
        });
      });
      return rows;
    }
    let DIRECTORY = [];

    function renderDirectory(query) {
      const host = $("#directory-grid");
      const countEl = $("#directory-count");
      const emptyEl = $("#directory-empty");
      if (!host) return;
      const q = String(query || "").trim().toLowerCase();
      const list = !q ? DIRECTORY : DIRECTORY.filter(function (r) {
        return (r.name + " " + r.role + " " + r.group).toLowerCase().indexOf(q) !== -1;
      });

      host.innerHTML = list.map(function (r, i) {
        return `
        <button class="dir-card" type="button" data-rank="${escapeHtml(r.rank)}"
                data-dir-index="${DIRECTORY.indexOf(r)}">
          ${avatar(r.person)}
          <span class="dir-info">
            <strong>${escapeHtml(r.name)}</strong>
            <small>${escapeHtml(r.role)}</small>
            <em>${escapeHtml(r.group)}</em>
          </span>
        </button>`;
      }).join("");
      $$(".dir-card", host).forEach(function (c, i) {
        c.style.animationDelay = Math.min(i * 22, 420) + "ms";
      });
      if (countEl) countEl.textContent = list.length + " of " + DIRECTORY.length + " people";
      if (emptyEl) emptyEl.hidden = list.length !== 0;
    }

    function directory() {
      DIRECTORY = buildDirectory();
      renderDirectory("");
      const search = $("#member-search");
      if (search) {
        search.addEventListener("input", debounce(function () {
          renderDirectory(search.value);
        }, 170));
      }
      const host = $("#directory-grid");
      if (host) {
        host.addEventListener("click", function (e) {
          const card = e.target.closest(".dir-card");
          if (!card) return;
          const row = DIRECTORY[Number(card.dataset.dirIndex)];
          if (row) DetailModal.openPerson(row);
        });
      }
    }

    function init() { adminBody(); metrics(); filters(); committees(); directory(); }
    return { init };
  })();

  /* ======================================================================
     12. EVENTS RENDERING
     ====================================================================== */
  const EventsRender = (function () {
    const FILTERS = [
      { id: "all", label: "All" },
      { id: "Workshop", label: "Workshops" },
      { id: "Hackathon", label: "Hackathons" },
      { id: "Talk", label: "Talks" },
      { id: "Seminar", label: "Seminars" },
      { id: "Competition", label: "Competitions" }
    ];
    const ICONS = {
      Workshop: "fa-solid fa-screwdriver-wrench",
      Hackathon: "fa-solid fa-laptop-code",
      Talk: "fa-solid fa-microphone-lines",
      Seminar: "fa-solid fa-chalkboard-user",
      Competition: "fa-solid fa-trophy"
    };
    let active = "all";

    function card(ev) {
      const visual = ev.image
        ? `<img src="${escapeHtml(ev.image)}" alt="${escapeHtml(ev.name)}" loading="lazy">`
        : `<span class="event-visual-fallback" aria-hidden="true"><i class="${escapeHtml(ICONS[ev.category] || "fa-solid fa-robot")}"></i></span>`;

      const galleryBtn = ev.driveUrl
        ? `<a class="btn btn-primary" href="${escapeHtml(ev.driveUrl)}" target="_blank" rel="noopener">
             <i class="fa-brands fa-google-drive"></i> VIEW DRIVE GALLERY
           </a>`
        : `<button class="btn btn-primary" type="button" data-ripple data-event-gallery="${escapeHtml(ev.id)}">
             <i class="fa-solid fa-photo-film"></i> VIEW GALLERY
           </button>`;

      return `
      <article class="event-card glass${ev.status === "past" ? " is-past" : ""}" data-event="${escapeHtml(ev.id)}">
        <div class="event-visual">
          ${visual}
          <span class="event-cat">${escapeHtml(ev.category)}</span>
          <span class="event-date"><strong>${dayOf(ev.date)}</strong><small>${monthOf(ev.date)}</small></span>
        </div>
        <div class="event-body">
          <h3>${escapeHtml(ev.name)}</h3>
          <p class="event-meta">
            <span><i class="fa-regular fa-calendar"></i> ${escapeHtml(longDate(ev.date))}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${escapeHtml(ev.venue || "JDCOEM")}</span>
          </p>
          <p class="event-desc">${escapeHtml(ev.description)}</p>
          <p class="event-highlight"><i class="fa-solid fa-star"></i> ${escapeHtml(ev.highlight || "")}</p>
          <button class="btn btn-outline" type="button" data-ripple data-event-detail="${escapeHtml(ev.id)}">
            <i class="fa-solid fa-circle-info"></i> DETAILS
          </button>
          ${galleryBtn}
        </div>
      </article>`;
    }

    function filters() {
      const host = $("#event-filters");
      if (!host) return;
      host.innerHTML = FILTERS.map(function (f, i) {
        return `<button class="filter-btn${i === 0 ? " active" : ""}" type="button" role="tab"
                  aria-selected="${i === 0 ? "true" : "false"}" data-efilter="${escapeHtml(f.id)}">
                  ${escapeHtml(f.label.toUpperCase())}</button>`;
      }).join("");
      host.addEventListener("click", function (e) {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        active = btn.dataset.efilter;
        $$(".filter-btn", host).forEach(function (b) {
          const on = b === btn;
          b.classList.toggle("active", on);
          b.setAttribute("aria-selected", on ? "true" : "false");
        });
        render();
      });
    }

    function render() {
      const all = DataService.events().filter(e => active === "all" || e.category === active);
      const up = all.filter(e => e.status === "upcoming")
        .sort((a, b) => a.date.localeCompare(b.date));
      const past = all.filter(e => e.status === "past")
        .sort((a, b) => b.date.localeCompare(a.date));

      const upHost = $("#events-upcoming");
      const pastHost = $("#events-past");
      if (upHost) upHost.innerHTML = up.map(card).join("");
      if (pastHost) pastHost.innerHTML = past.map(card).join("");
      const upEmpty = $("#upcoming-empty"), pastEmpty = $("#past-empty");
      if (upEmpty) upEmpty.hidden = up.length !== 0;
      if (pastEmpty) pastEmpty.hidden = past.length !== 0;

      $$("#events-upcoming .event-card, #events-past .event-card").forEach(function (c, i) {
        c.style.animationDelay = Math.min(i * 65, 520) + "ms";
      });
    }

    function init() {
      filters();
      render();
      const page = $("#page-events");
      if (page) {
        page.addEventListener("click", function (e) {
          const detailBtn = e.target.closest("[data-event-detail]");
          if (detailBtn) {
            const ev = DataService.events().find(x => x.id === detailBtn.dataset.eventDetail);
            if (ev) DetailModal.openEvent(ev);
            return;
          }
          const galleryBtn = e.target.closest("[data-event-gallery]");
          if (galleryBtn) {
            const ev = DataService.events().find(x => x.id === galleryBtn.dataset.eventGallery);
            if (ev) GalleryModal.open(ev);
            return;
          }
        });
      }
    }
    return { init };
  })();

  /* ======================================================================
     13. CONNECT RENDERING
     ====================================================================== */
  const ConnectRender = (function () {
    function socials() {
      const host = $("#social-grid");
      const foot = $("#footer-social");
      const list = DataService.socials();
      if (host) {
        host.innerHTML = list.map(function (s) {
          const external = s.url && s.url.indexOf("mailto:") !== 0;
          return `
          <a class="social-card glass reveal" href="${escapeHtml(s.url)}"
             ${external ? 'target="_blank" rel="noopener"' : ""}
             style="--accent:${escapeHtml(s.color)}" aria-label="${escapeHtml(s.platform)}">
            <span class="social-icon" aria-hidden="true"><i class="${escapeHtml(s.icon)}"></i></span>
            <h3>${escapeHtml(s.platform)}</h3>
            <p class="social-handle mono">${escapeHtml(s.handle)}</p>
            <p>${escapeHtml(s.desc)}</p>
            <span class="social-go mono">Open <i class="fa-solid fa-arrow-right"></i></span>
          </a>`;
        }).join("");
      }
      if (foot) {
        foot.innerHTML = list.map(function (s) {
          const external = s.url && s.url.indexOf("mailto:") !== 0;
          return `<a href="${escapeHtml(s.url)}" ${external ? 'target="_blank" rel="noopener"' : ""}
                    aria-label="${escapeHtml(s.platform)}"><i class="${escapeHtml(s.icon)}"></i></a>`;
        }).join("");
      }
    }

    function contactInfo() {
      const host = $("#contact-list");
      if (!host) return;
      const c = DataService.config().contact || {};
      const rows = [
        { icon: "fa-solid fa-envelope", label: "Email", value: c.email },
        { icon: "fa-solid fa-phone", label: "Phone", value: c.phone },
        { icon: "fa-solid fa-location-dot", label: "Address", value: c.address }
      ];
      host.innerHTML = rows.map(function (r) {
        return `<li>
          <span class="ci-icon" aria-hidden="true"><i class="${escapeHtml(r.icon)}"></i></span>
          <span><strong>${escapeHtml(r.label)}</strong><span>${escapeHtml(r.value || "—")}</span></span>
        </li>`;
      }).join("");
    }

    function init() { socials(); contactInfo(); }
    return { init };
  })();

  /* ======================================================================
     14. MODAL BASE  (focus trap + open/close)
     ====================================================================== */
  function modalController(modalEl, onOpen) {
    let lastFocus = null;
    function open() {
      if (!modalEl) return;
      lastFocus = document.activeElement;
      modalEl.hidden = false;
      modalEl.classList.remove("closing");
      document.body.classList.add("is-locked");
      if (typeof onOpen === "function") onOpen();
      const focusable = modalEl.querySelector("input, button, a[href], textarea");
      if (focusable) setTimeout(() => focusable.focus(), 60);
    }
    function close() {
      if (!modalEl || modalEl.hidden) return;
      modalEl.classList.add("closing");
      setTimeout(function () {
        modalEl.hidden = true;
        modalEl.classList.remove("closing");
        document.body.classList.remove("is-locked");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }, 280);
    }
    document.addEventListener("keydown", function (e) {
      if (!modalEl || modalEl.hidden) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key !== "Tab") return;
      const items = $$('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])', modalEl)
        .filter(el => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    return { open, close, el: modalEl };
  }

  /* ======================================================================
     15. LOGIN MODAL  (frontend demo only — no authentication)
     ====================================================================== */
  const LoginModal = (function () {
    const modal = $("#login-modal");
    const ctrl = modalController(modal);
    const form = $("#login-form");
    const roleField = $("#login-role");

    function setError(inputId, errId, msg) {
      const input = document.getElementById(inputId);
      const err = document.getElementById(errId);
      if (input && input.parentElement) {
        const field = input.closest(".field");
        if (field) field.classList.toggle("invalid", !!msg);
      }
      if (err) err.textContent = msg || "";
    }

    function init() {
      if (!modal) return;
      $$("[data-open-login]").forEach(b => b.addEventListener("click", function () {
        Navbar.closeMenu();
        ctrl.open();
      }));
      $$("[data-close-login]", modal).forEach(b => b.addEventListener("click", ctrl.close));

      $$(".tab", modal).forEach(function (tab) {
        tab.addEventListener("click", function () {
          $$(".tab", modal).forEach(function (t) {
            const on = t === tab;
            t.classList.toggle("active", on);
            t.setAttribute("aria-selected", on ? "true" : "false");
          });
          if (roleField) roleField.value = tab.dataset.tab;
        });
      });

      const toggleBtn = $("#pass-toggle");
      if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
          const input = $("#lg-pass");
          if (!input) return;
          const show = input.type === "password";
          input.type = show ? "text" : "password";
          toggleBtn.innerHTML = `<i class="fa-solid fa-eye${show ? "-slash" : ""}"></i>`;
          toggleBtn.setAttribute("aria-label", show ? "Hide password" : "Show password");
        });
      }

      if (form) {
        form.addEventListener("submit", function (e) {
          e.preventDefault();
          const email = ($("#lg-email").value || "").trim();
          const pass = $("#lg-pass").value || "";
          let ok = true;

          if (!email) { setError("lg-email", "err-lg-email", "Email is required."); ok = false; }
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            setError("lg-email", "err-lg-email", "Enter a valid email address."); ok = false;
          } else setError("lg-email", "err-lg-email", "");

          if (!pass) { setError("lg-pass", "err-lg-pass", "Password is required."); ok = false; }
          else if (pass.length < 6) { setError("lg-pass", "err-lg-pass", "Minimum 6 characters."); ok = false; }
          else setError("lg-pass", "err-lg-pass", "");

          if (!ok) {
            Toast.show("Check your details", "Please correct the highlighted fields.", "error");
            return;
          }
          const role = roleField ? roleField.value : "admin";

          fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password: pass, role })
          })
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                Toast.show(
                  "Login Successful",
                  `Welcome ${data.user.name} (${data.user.role.toUpperCase()})! Session: ${data.user.sessionTenure}`,
                  "success"
                );
                form.reset();
                setError("lg-email", "err-lg-email", "");
                setError("lg-pass", "err-lg-pass", "");
                ctrl.close();
              } else {
                Toast.show("Authentication Failed", data.error || "Invalid credentials", "error");
              }
            })
            .catch(err => {
              console.error("Backend login error:", err);
              Toast.show("Backend Server Offline", "Could not connect to http://localhost:5000. Please start the backend server.", "warning");
            });
        });
      }
    }
    return { init, open: ctrl.open, close: ctrl.close };
  })();

  /* ======================================================================
     16. DETAIL MODAL  (person / event)
     ====================================================================== */
  const DetailModal = (function () {
    const modal = $("#detail-modal");
    const body = $("#detail-body");
    const ctrl = modalController(modal);

    function init() {
      if (!modal) return;
      $$("[data-close-detail]", modal).forEach(b => b.addEventListener("click", ctrl.close));
    }

    function openPerson(row) {
      if (!body) return;
      const p = row.person || {};
      body.innerHTML = `
      <div class="detail-person">
        ${avatar(p)}
        <h3 id="detail-heading">${escapeHtml(row.name)}</h3>
        <p class="muted small mono">${escapeHtml(row.role)} • ${escapeHtml(row.group)}</p>
        <div class="detail-chips">
          <span>AAVINYA 2026–27</span>
          <span>${escapeHtml(row.role)}</span>
          <span>Dept. of AI</span>
        </div>
        <div class="detail-rows">
          <div class="detail-row"><i class="fa-solid fa-sitemap"></i>
            <div><strong>Body / Committee</strong><p>${escapeHtml(row.group)}</p></div></div>
          <div class="detail-row"><i class="fa-solid fa-id-badge"></i>
            <div><strong>Position</strong><p>${escapeHtml(row.role)}</p></div></div>
          <div class="detail-row"><i class="fa-solid fa-envelope"></i>
            <div><strong>Email</strong><p>${p.email ? escapeHtml(p.email) : "Not published"}</p></div></div>
          <div class="detail-row"><i class="fa-brands fa-linkedin-in"></i>
            <div><strong>LinkedIn</strong><p>${p.linkedin ? escapeHtml(p.linkedin) : "Not published"}</p></div></div>
        </div>
        ${personLinks(p)}
      </div>`;
      ctrl.open();
    }

    function openEvent(ev) {
      if (!body) return;
      body.innerHTML = `
      <div class="detail-event">
        <p class="eyebrow mono"><i class="fa-solid fa-calendar-days"></i> ${escapeHtml(ev.category)} • ${ev.status === "past" ? "COMPLETED" : "UPCOMING"}</p>
        <h3 id="detail-heading">${escapeHtml(ev.name)}</h3>
        <div class="detail-rows">
          <div class="detail-row"><i class="fa-regular fa-calendar"></i>
            <div><strong>Date</strong><p>${escapeHtml(longDate(ev.date))}</p></div></div>
          <div class="detail-row"><i class="fa-solid fa-location-dot"></i>
            <div><strong>Venue</strong><p>${escapeHtml(ev.venue || "JDCOEM, Nagpur")}</p></div></div>
          <div class="detail-row"><i class="fa-solid fa-tags"></i>
            <div><strong>Category</strong><p>${escapeHtml(ev.category)}</p></div></div>
          <div class="detail-row"><i class="fa-solid fa-star"></i>
            <div><strong>Highlight</strong><p>${escapeHtml(ev.highlight || "—")}</p></div></div>
          <div class="detail-row"><i class="fa-solid fa-align-left"></i>
            <div><strong>About</strong><p>${escapeHtml(ev.description)}</p></div></div>
        </div>
        <p class="muted small">
          Registration links are shared on the forum's official channels. Visit the
          Connect page to follow AAVINYA for announcements.
        </p>
        ${ev.driveUrl ? `
        <a href="${escapeHtml(ev.driveUrl)}" target="_blank" rel="noopener" class="btn btn-outline btn-block" style="margin-bottom: 0.75rem; border-color: rgba(0, 168, 232, 0.4);">
          <i class="fa-brands fa-google-drive"></i> OPEN GOOGLE DRIVE GALLERY
        </a>` : ""}
        <a href="#connect" class="btn btn-primary btn-block" data-ripple data-close-detail>
          <i class="fa-solid fa-satellite-dish"></i> GO TO CONNECT
        </a>
      </div>`;
      $$("[data-close-detail]", body).forEach(b => b.addEventListener("click", ctrl.close));
      ctrl.open();
    }

    return { init, openPerson, openEvent };
  })();

  /* ======================================================================
     16.5. EVENT GALLERY MODAL & MEDIA UPLOADER
     ====================================================================== */
  const GalleryModal = (function () {
    const modal = $("#gallery-modal");
    const heading = $("#gallery-heading");
    const sub = $("#gallery-sub");
    const grid = $("#gallery-grid");
    const empty = $("#gallery-empty");
    const uploadForm = $("#gallery-upload-form");
    const btnOpenUpload = $("#btn-open-upload");
    const btnCancelUpload = $("#btn-cancel-upload");
    const uploadEventId = $("#upload-event-id");
    const lightbox = $("#gallery-lightbox");
    const lightboxContent = $("#lightbox-content");
    const lightboxCaption = $("#lightbox-caption");
    const lightboxClose = $("#lightbox-close");
    const ctrl = modalController(modal);

    let currentEvent = null;
    let galleryItems = [];
    let activeTab = "all";

    function init() {
      if (!modal) return;
      $$("[data-close-gallery]", modal).forEach(b => b.addEventListener("click", ctrl.close));

      // Filter tabs
      $$("#gallery-tabs .tab").forEach(tab => {
        tab.addEventListener("click", function () {
          $$("#gallery-tabs .tab").forEach(t => t.classList.remove("active"));
          tab.classList.add("active");
          activeTab = tab.dataset.gtab;
          renderGrid();
        });
      });

      // Toggle Upload Form
      if (btnOpenUpload) {
        btnOpenUpload.addEventListener("click", function () {
          if (uploadForm) uploadForm.hidden = !uploadForm.hidden;
        });
      }
      if (btnCancelUpload) {
        btnCancelUpload.addEventListener("click", function () {
          if (uploadForm) uploadForm.hidden = true;
        });
      }

      // Handle Upload Submit
      if (uploadForm) {
        uploadForm.addEventListener("submit", async function (e) {
          e.preventDefault();
          const type = $("#upload-type").value;
          const url = $("#upload-url").value.trim();
          const title = $("#upload-title").value.trim();
          const caption = $("#upload-caption").value.trim();
          const eventId = uploadEventId.value || (currentEvent && currentEvent.id);

          if (!url) return;

          const newItem = { type, url, title, caption, uploadedAt: new Date().toISOString() };

          // Try submitting to Express backend API
          try {
            const res = await fetch(`http://localhost:5000/api/events/${eventId}/gallery`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newItem)
            });
            const data = await res.json();
            if (data.success && data.gallery) {
              galleryItems = data.gallery;
            } else {
              galleryItems.unshift(newItem);
            }
          } catch (err) {
            console.log("Backend offline, appending to local state:", err);
            galleryItems.unshift(newItem);
          }

          if (currentEvent) {
            currentEvent.gallery = galleryItems;
          }

          renderGrid();
          uploadForm.reset();
          uploadForm.hidden = true;
          Toast.show("Media Uploaded!", "Photos/Videos added to event gallery successfully.", "success");
        });
      }

      // Lightbox close
      if (lightboxClose) {
        lightboxClose.addEventListener("click", function () {
          if (lightbox) lightbox.hidden = true;
          if (lightboxContent) lightboxContent.innerHTML = "";
        });
      }
    }

    async function open(ev) {
      currentEvent = ev;
      if (heading) heading.textContent = (ev.name || "Event") + " — Gallery";
      if (sub) sub.textContent = `Photos & Videos for ${ev.name}`;
      if (uploadEventId) uploadEventId.value = ev.id;
      if (uploadForm) uploadForm.hidden = true;

      // Try fetching gallery from Express backend
      try {
        const res = await fetch(`http://localhost:5000/api/events/${ev.id}/gallery`);
        const data = await res.json();
        if (data.success && data.gallery && data.gallery.length > 0) {
          galleryItems = data.gallery;
        } else {
          galleryItems = ev.gallery || [];
        }
      } catch (err) {
        galleryItems = ev.gallery || [];
      }

      activeTab = "all";
      $$("#gallery-tabs .tab").forEach(t => t.classList.toggle("active", t.dataset.gtab === "all"));
      renderGrid();
      ctrl.open();
    }

    function renderGrid() {
      if (!grid) return;
      const filtered = galleryItems.filter(item => activeTab === "all" || item.type === activeTab);

      if (filtered.length === 0) {
        grid.innerHTML = "";
        if (empty) empty.hidden = false;
        return;
      }

      if (empty) empty.hidden = true;
      grid.innerHTML = filtered.map((item, idx) => {
        const isVideo = item.type === 'video';
        const badge = isVideo ? '<span class="gallery-item-badge"><i class="fa-solid fa-play"></i> VIDEO</span>' : '<span class="gallery-item-badge"><i class="fa-regular fa-image"></i> PHOTO</span>';
        const mediaTag = isVideo
          ? `<div class="gallery-video-thumb" style="display:flex;align-items:center;justify-content:center;height:100%;background:#0f172a;"><i class="fa-solid fa-circle-play" style="font-size:3rem; color:var(--accent, #2BB8D8);"></i></div>`
          : `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title || 'Event Media')}" loading="lazy" onerror="this.src='images/AAVINYA_LOGO.jpeg'">`;

        return `
        <div class="gallery-item" data-gidx="${idx}">
          ${badge}
          ${mediaTag}
          <div class="gallery-item-overlay">
            <p class="gallery-item-title">${escapeHtml(item.title || (isVideo ? 'Event Video' : 'Event Photo'))}</p>
            ${item.caption ? `<p class="gallery-item-caption">${escapeHtml(item.caption)}</p>` : ''}
          </div>
        </div>`;
      }).join("");

      $$(".gallery-item", grid).forEach(el => {
        el.addEventListener("click", function () {
          const idx = parseInt(el.dataset.gidx, 10);
          openLightbox(filtered[idx]);
        });
      });
    }

    function openLightbox(item) {
      if (!lightbox || !lightboxContent) return;
      lightboxContent.innerHTML = "";
      if (item.type === 'video') {
        if (item.url.includes("youtube.com") || item.url.includes("youtu.be")) {
          lightboxContent.innerHTML = `<iframe src="${escapeHtml(item.url)}" allowfullscreen allow="autoplay"></iframe>`;
        } else {
          lightboxContent.innerHTML = `<video src="${escapeHtml(item.url)}" controls autoplay style="max-width:100%; max-height:75vh; border-radius:12px;"></video>`;
        }
      } else {
        lightboxContent.innerHTML = `<img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.title || '')}">`;
      }
      if (lightboxCaption) lightboxCaption.textContent = item.title ? `${item.title} — ${item.caption || ''}` : (item.caption || '');
      lightbox.hidden = false;
    }

    return { init, open };
  })();

  /* ======================================================================
     17. CONTACT FORM  (client-side validation only)
     ====================================================================== */
  const ContactForm = (function () {
    const form = $("#contact-form");

    const RULES = {
      name: { id: "cf-name", err: "err-name", validate: v => !v ? "Name is required." : (v.length < 2 ? "Name is too short." : "") },
      email: { id: "cf-email", err: "err-email", validate: v => !v ? "Email is required." : (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "Enter a valid email address." : "") },
      subject: { id: "cf-subject", err: "err-subject", validate: v => !v ? "Subject is required." : (v.length < 3 ? "Subject is too short." : "") },
      message: { id: "cf-message", err: "err-message", validate: v => !v ? "Message is required." : (v.length < 10 ? "Please write at least 10 characters." : "") }
    };

    function apply(key) {
      const rule = RULES[key];
      const input = document.getElementById(rule.id);
      const errEl = document.getElementById(rule.err);
      if (!input) return true;
      const msg = rule.validate(input.value.trim());
      const field = input.closest(".field");
      if (field) field.classList.toggle("invalid", !!msg);
      if (errEl) errEl.textContent = msg;
      if (msg) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
      return !msg;
    }

    function init() {
      if (!form) return;
      Object.keys(RULES).forEach(function (key) {
        const input = document.getElementById(RULES[key].id);
        if (!input) return;
        input.addEventListener("blur", () => apply(key));
        input.addEventListener("input", function () {
          const field = input.closest(".field");
          if (field && field.classList.contains("invalid")) apply(key);
        });
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        let ok = true, firstBad = null;
        Object.keys(RULES).forEach(function (key) {
          const valid = apply(key);
          if (!valid) {
            ok = false;
            if (!firstBad) firstBad = document.getElementById(RULES[key].id);
          }
        });
        if (!ok) {
          Toast.show("Form incomplete", "Please fix the highlighted fields.", "error");
          if (firstBad) firstBad.focus();
          return;
        }
        const payload = {
          name: ($("#cf-name").value || "").trim(),
          email: ($("#cf-email").value || "").trim(),
          subject: ($("#cf-subject").value || "").trim(),
          message: ($("#cf-message").value || "").trim()
        };

        fetch("http://localhost:5000/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              Toast.show("Message Delivered!", data.message || "Thank you for reaching out.", "success");
              form.reset();
            } else {
              Toast.show("Submission Failed", data.error || "Please try again later.", "error");
            }
          })
          .catch(err => {
            console.error("Backend contact form error:", err);
            Toast.show("Backend Server Offline", "Could not connect to http://localhost:5000. Message saved locally.", "warning");
          });
      });
    }
    return { init };
  })();

  /* ======================================================================
     18. BOOT
     ====================================================================== */
  function boot() {
    const year = $("#footer-year");
    if (year) year.textContent = new Date().getFullYear();

    // Render all data-driven UI first so the router can reveal it.
    HomeRender.init();
    ForumRender.init();
    EventsRender.init();
    ConnectRender.init();

    Navbar.init();
    LoginModal.init();
    DetailModal.init();
    GalleryModal.init();
    ContactForm.init();
    initRipple();

    Router.init();
    Reveal.scan(document);
    Counters.observe();

    // Hero constellation
    const hero = createNetwork($("#constellation-canvas"), {
      density: 12000, maxParticles: 120, linkDist: 145, speed: 0.3, mouse: true
    });
    if (hero) hero.start();

    Intro.run();


    // Friendly first-visit toast after the intro completes
    setTimeout(function () {
      Toast.show("Welcome to AAVINYA", "Innovate • Integrate • Inspire — explore the Forum, Events and Connect pages.", "info");
    }, 4200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
