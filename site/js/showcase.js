/* Kairos decomposed showcases (P4, "Flat A") — scroll parallax + pointer lean
 * for the .showcase instances on the index page. Wiring adapted from the
 * proven PoC (docs/reference/poc-decomposition.html): transform-only, one
 * shared rAF loop that runs only while a showcase is on screen.
 *
 * Touch devices and prefers-reduced-motion get the static tilted composition
 * straight from CSS — this file then never starts the loop. The compositions
 * must always read as one assembled screen: parallax drift is a few px by
 * layer depth, the lean is a couple of degrees.
 */

(function () {
  "use strict";

  var showcases = Array.prototype.slice.call(document.querySelectorAll(".showcase"));
  if (!showcases.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(pointer: fine)");

  var items = showcases.map(function (el) {
    var scene = el.querySelector(".sc-scene");
    return {
      el: el,
      scene: scene,
      layers: Array.prototype.slice.call(el.querySelectorAll(".sc-layer")).map(function (l) {
        return { el: l, z: parseFloat(getComputedStyle(l).getPropertyValue("--z")) || 0 };
      }),
      baseRx: parseFloat(getComputedStyle(scene).getPropertyValue("--rx")) || 6,
      baseRy: parseFloat(getComputedStyle(scene).getPropertyValue("--ry")) || -14,
      visible: false,
      // pointer lean state: target and eased current, both -1..1
      tx: 0, ty: 0, cx: 0, cy: 0
    };
  });

  items.forEach(function (it) {
    it.el.addEventListener("mousemove", function (e) {
      var r = it.el.getBoundingClientRect();
      it.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      it.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    });
    it.el.addEventListener("mouseleave", function () { it.tx = 0; it.ty = 0; });
  });

  var rafId = null;
  function frame() {
    var vh = window.innerHeight;
    var any = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.visible) continue;
      any = true;

      // section progress through the viewport: -1 (below) .. 0 (centered) .. 1 (above)
      var r = it.el.getBoundingClientRect();
      var p = (vh / 2 - (r.top + r.height / 2)) / vh;
      if (p < -1) p = -1; else if (p > 1) p = 1;

      // eased pointer lean
      it.cx += (it.tx - it.cx) * 0.08;
      it.cy += (it.ty - it.cy) * 0.08;

      it.scene.style.transform =
        "rotateX(" + (it.baseRx - it.cy * 2.5).toFixed(3) + "deg) " +
        "rotateY(" + (it.baseRy + it.cx * 3.5).toFixed(3) + "deg)";

      // satellites drift a few px more than the base as the section passes
      for (var j = 0; j < it.layers.length; j++) {
        var l = it.layers[j];
        l.el.style.transform =
          "translateZ(" + l.z + "px) translateY(" + (-p * l.z * 0.22).toFixed(2) + "px)";
      }
    }
    rafId = any ? requestAnimationFrame(frame) : null;
  }

  function syncLoop() {
    var shouldRun = !reduceMotion.matches && finePointer.matches && !document.hidden &&
      items.some(function (it) { return it.visible; });
    if (shouldRun && rafId === null) {
      rafId = requestAnimationFrame(frame);
    } else if (!shouldRun && rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  if (!("IntersectionObserver" in window)) return; // static CSS composition stands
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].el === entry.target) items[i].visible = entry.isIntersecting;
      }
    });
    syncLoop();
  }, { rootMargin: "60px 0px" });
  items.forEach(function (it) { io.observe(it.el); });

  document.addEventListener("visibilitychange", syncLoop);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", syncLoop);
})();
