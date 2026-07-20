/* Kairos landing — site JS. Vanilla, no build step, loaded `defer` on every page.
 * Keep this dependency-free and small. */

(function () {
  "use strict";

  // Nav two-state reveal: the logo lockup and the purple "Get the App" CTA are
  // hidden while the hero fills the viewport, reveal together once the visitor
  // scrolls past it, and shrink back to the compact state when they return to
  // the top of the hero.
  //
  // Fallback: if the hero badge row is absent (terms / privacy / 404 — no
  // hero), both reveal unconditionally = full state always.
  // prefers-reduced-motion is handled in CSS, not here.
  (function initNavReveal() {
    // #search is the first section after the hero (was #how before the split).
    var trigger = document.getElementById("search");
    var reveals = [
      document.getElementById("nav-logo"),
      document.getElementById("nav-download"),
    ].filter(Boolean);
    if (!reveals.length) return;

    function setShown(shown) {
      reveals.forEach(function (el) {
        el.classList.toggle("show", shown);
        el.setAttribute("aria-hidden", shown ? "false" : "true");
      });
    }

    // No trigger section (subpages have no hero/#search): full state always.
    if (!trigger) {
      setShown(true);
      return;
    }

    // Grow the nav while #search has risen into the top 60% of the viewport
    // (the hero is ~40% scrolled past the top); shrink it back when the visitor
    // scrolls above that line, back toward the top of the hero. Geometry-driven
    // on scroll (rAF-throttled) and re-evaluated every frame in BOTH directions,
    // not an IntersectionObserver: a thin-band IO can miss a fast/large scroll
    // jump between frames, whereas reading the trigger's current position each
    // frame can't. Listeners stay attached so the state tracks scroll both ways.
    var ticking = false;
    function check() {
      ticking = false;
      setShown(trigger.getBoundingClientRect().top <= window.innerHeight * 0.6);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(check);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    check(); // covers a page that loads already scrolled past the trigger
  })();

  // Pricing monthly/yearly toggle: swaps the paid plan's price and period text
  // from data-monthly / data-yearly attributes and keeps aria-pressed in sync.
  // No-op on pages without the pricing section. Text swap only — no layout
  // changes, so there is nothing to animate (and nothing for reduced-motion).
  (function initPricingToggle() {
    var monthlyBtn = document.getElementById("billing-monthly");
    var yearlyBtn = document.getElementById("billing-yearly");
    var price = document.getElementById("paid-price");
    var per = document.getElementById("paid-per");
    if (!monthlyBtn || !yearlyBtn || !price || !per) return;

    function setPeriod(period) {
      var monthly = period === "monthly";
      monthlyBtn.setAttribute("aria-pressed", String(monthly));
      yearlyBtn.setAttribute("aria-pressed", String(!monthly));
      var attr = monthly ? "data-monthly" : "data-yearly";
      price.textContent = price.getAttribute(attr);
      per.textContent = per.getAttribute(attr);
    }

    monthlyBtn.addEventListener("click", function () { setPeriod("monthly"); });
    yearlyBtn.addEventListener("click", function () { setPeriod("yearly"); });
  })();

  // Nav scroll-spy: mark the section currently in view. The matching section
  // link gets aria-current="location" (styled as the "current" pill state in
  // src/main.css). Index only — subpage nav hrefs are cross-page "/#id" and
  // match no local section, so this no-ops there. No animation of its own (the
  // CSS color/background transition handles the visual), nothing for
  // reduced-motion to disable.
  (function initNavCurrentSection() {
    var container = document.getElementById("nav-links");
    if (!container) return;

    var map = [];
    Array.prototype.forEach.call(
      container.querySelectorAll('a[href^="#"]'),
      function (link) {
        var section = document.getElementById(link.hash.slice(1));
        if (section) map.push({ link: link, section: section });
      }
    );
    if (!map.length) return; // subpages: nav hrefs are "/#id", no local match

    var current = null;
    function setCurrent(link) {
      if (link === current) return;
      if (current) current.removeAttribute("aria-current");
      current = link;
      if (current) current.setAttribute("aria-current", "location");
    }

    // The section in view = the one whose top edge has most recently passed a
    // reading line ~40% down the viewport. Scanned by geometry rather than
    // assumed DOM order, since nav-link order isn't guaranteed to track section
    // order on the page. Nothing is marked while the hero fills the viewport —
    // the hero has no nav link.
    function update() {
      var lineY = window.innerHeight * 0.4;
      var best = null, bestTop = -Infinity;
      map.forEach(function (m) {
        var top = m.section.getBoundingClientRect().top;
        if (top <= lineY && top > bestTop) { bestTop = top; best = m.link; }
      });
      setCurrent(best);
    }

    // Recomputed on scroll (rAF-throttled), not via IntersectionObserver: a
    // thin-band IO only fires on edge-crossing events, and a fast/continuous
    // scroll can carry a section's edge across that band between two IO
    // check frames with no callback at all — the highlight then lags until
    // some later, unrelated crossing happens to fire (reported as "highlight
    // lags behind significantly"). A per-frame recompute can't miss it.
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  })();

  // Scroll motion (P6c): section-reveal cascade + page-wide background parallax,
  // both geometry-driven on scroll (rAF-throttled) — same pattern as the nav
  // scroll-spy above, chosen over IntersectionObserver so the reveal can trigger
  // at a precise reading line (~75% of viewport height, not the first pixel of
  // intersection) and replay in BOTH directions with hysteresis. This block is
  // NOT the hands-off nav pattern; it's the P6c motion system.
  //
  // Reveal: each `main > section.reveal` toggles `.is-visible`; the CSS cascades
  // its `.reveal-piece` children (staggered) and pops its score chips. Activates
  // when the section's top rises past 75% vh; resets only once the section is
  // fully out of view plus a 15% margin (hysteresis stops boundary flicker), so
  // it replays on re-entry. The hero is excluded (own `.loaded` entrance).
  //
  // Parallax: every `[data-parallax]` ambient layer (background art, glow
  // fields, orrery) gets a `--sy` offset each frame so it drifts at a different
  // rate than the content (attribute value = speed, ~0.06-0.10). Transform-only
  // via the `.parallax*` classes.
  (function initScrollMotion() {
    var sections = Array.prototype.slice.call(
      document.querySelectorAll("main > section.reveal")
    );
    var parallaxEls = Array.prototype.slice.call(
      document.querySelectorAll("[data-parallax]")
    );
    if (!sections.length && !parallaxEls.length) return;

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    function freezeVisible() {
      sections.forEach(function (s) { s.classList.add("is-visible"); });
      parallaxEls.forEach(function (el) { el.style.setProperty("--sy", "0px"); });
    }

    // Reduced motion: reveal everything, no parallax, no scroll work.
    if (reduce.matches) { freezeVisible(); return; }

    function updateReveal(vh) {
      for (var i = 0; i < sections.length; i++) {
        var s = sections[i];
        var r = s.getBoundingClientRect();
        if (!s.classList.contains("is-visible")) {
          // activate once the top passes the 75% reading line and it's in view
          if (r.top < vh * 0.75 && r.bottom > vh * 0.15) s.classList.add("is-visible");
        } else {
          // reset only when fully out of view (+15% hysteresis) so it replays
          if (r.bottom < -vh * 0.15 || r.top > vh * 1.15) s.classList.remove("is-visible");
        }
      }
    }

    function updateParallax(vh) {
      for (var i = 0; i < parallaxEls.length; i++) {
        var el = parallaxEls[i];
        var speed = parseFloat(el.getAttribute("data-parallax")) || 0.08;
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        el.style.setProperty("--sy", ((vh / 2 - center) * speed).toFixed(1) + "px");
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var vh = window.innerHeight;
        updateReveal(vh);
        updateParallax(vh);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // initial pass: reveal anything already in view + seed parallax offsets
    var vh0 = window.innerHeight;
    updateReveal(vh0);
    updateParallax(vh0);

    // if reduced-motion is switched on mid-session, freeze everything visible
    if (reduce.addEventListener) {
      reduce.addEventListener("change", function () { if (reduce.matches) freezeVisible(); });
    }
  })();
})();
