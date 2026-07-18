/* Kairos landing — site JS. Vanilla, no build step, loaded `defer` on every page.
 * Keep this dependency-free and small. */

(function () {
  "use strict";

  // Header "Download" CTA: hidden while the hero store-badge row is on screen,
  // revealed once the visitor scrolls past it. IntersectionObserver (not a
  // scroll listener) — cheap and jank-free. Translated from the proven pattern
  // in kairos-landing-wireframe.html.
  //
  // Fallback: if IntersectionObserver is unavailable, or the elements are absent
  // (i.e. the hero stub isn't on this page — terms / privacy / 404), the CTA is
  // shown unconditionally. prefers-reduced-motion is handled in CSS, not here.
  (function initNavCtaReveal() {
    var heroCta = document.getElementById("hero-cta");
    var navCta = document.getElementById("nav-download");
    if (!navCta) return;

    if (!heroCta || !("IntersectionObserver" in window)) {
      navCta.classList.add("show");
      navCta.setAttribute("aria-hidden", "false");
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        var heroVisible = entries[0].isIntersecting;
        navCta.classList.toggle("show", !heroVisible);
        navCta.setAttribute("aria-hidden", heroVisible ? "true" : "false");
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
})();
