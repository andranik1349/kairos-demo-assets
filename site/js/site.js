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
})();
