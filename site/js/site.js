/* Kairos landing — site JS. Vanilla, no build step, loaded `defer` on every page.
 * Keep this dependency-free and small. */

(function () {
  "use strict";

  // Nav two-state reveal: the logo lockup and the purple "Get the App" CTA are
  // hidden while the hero store-badge row is on screen, and reveal together once
  // the visitor scrolls past it. IntersectionObserver (not a scroll listener) —
  // cheap and jank-free.
  //
  // Fallback: if IntersectionObserver is unavailable, or the hero badge row is
  // absent (terms / privacy / 404 — no hero), both reveal unconditionally =
  // full state always. prefers-reduced-motion is handled in CSS, not here.
  (function initNavReveal() {
    var heroCta = document.getElementById("hero-cta");
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

    if (!heroCta || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        setShown(!entries[0].isIntersecting);
      },
      { threshold: 0 }
    );
    io.observe(heroCta);
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
    if (!container || !("IntersectionObserver" in window)) return;

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
    // reading line ~40% down the viewport. Scanned by geometry, not DOM order,
    // because the nav-link order (what, how, ...) differs from the section
    // order on the page (how, features, what, ...). Nothing is marked while the
    // hero fills the viewport — the hero has no nav link.
    function update() {
      var lineY = window.innerHeight * 0.4;
      var best = null, bestTop = -Infinity;
      map.forEach(function (m) {
        var top = m.section.getBoundingClientRect().top;
        if (top <= lineY && top > bestTop) { bestTop = top; best = m.link; }
      });
      setCurrent(best);
    }

    // IO fires whenever a section edge crosses a thin band around the reading
    // line (~38-43% of the viewport) — a cheap trigger to recompute, with no
    // scroll listener. The band must stay non-zero height: a root collapsed to
    // a zero-height line never registers an intersection at threshold 0.
    var io = new IntersectionObserver(update, {
      rootMargin: "-38% 0px -57% 0px",
      threshold: 0,
    });
    map.forEach(function (m) { io.observe(m.section); });
    update();
  })();
})();
