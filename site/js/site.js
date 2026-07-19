/* Kairos landing — site JS. Vanilla, no build step, loaded `defer` on every page.
 * Keep this dependency-free and small. */

(function () {
  "use strict";

  // Nav two-state reveal: the logo lockup and the purple "Get the App" CTA are
  // hidden while the hero store-badge row is on screen, and reveal together,
  // permanently, once the visitor scrolls past it.
  //
  // Fallback: if the hero badge row is absent (terms / privacy / 404 — no
  // hero), both reveal unconditionally = full state always.
  // prefers-reduced-motion is handled in CSS, not here.
  (function initNavReveal() {
    // #how is the first section after the hero.
    var trigger = document.getElementById("how");
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

    // No trigger section (subpages have no hero/#how): full state always.
    if (!trigger) {
      setShown(true);
      return;
    }

    // Grow the nav once #how rises into the top 60% of the viewport — i.e. the
    // hero is ~40% scrolled past the top. Well before the hero ends. One-way
    // and geometry-driven on scroll (rAF-throttled), not an
    // IntersectionObserver: an IO here can miss the trigger entirely on a
    // large/fast scroll jump that never renders a frame where #how intersects
    // the observed band — with the observer disconnected after first fire (to
    // keep the reveal one-way), a missed trigger meant the nav could never
    // reveal for the rest of the session. A geometry check reads the
    // trigger's CURRENT position on every scroll frame, so it can't miss it,
    // and stops listening for good once shown.
    var ticking = false;
    function check() {
      ticking = false;
      if (trigger.getBoundingClientRect().top <= window.innerHeight * 0.6) {
        setShown(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
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
})();
