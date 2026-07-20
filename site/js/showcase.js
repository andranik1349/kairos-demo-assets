/* Kairos decomposed showcases — disassemble-on-scroll + idle float (P6c).
 *
 * The calm "assembled with depth" experiment (P4/P6b) read as static PNGs, so
 * P6c revives the disassemble concept and makes it unmistakable:
 *   - Scroll-linked separation: satellite layers pull apart at the showcase's
 *     entry/exit and converge to the assembled composition at center. Offsets
 *     60-120px scaled by layer depth, plus a few degrees of rotation on the
 *     closest layers. Scrubbed by the showcase's own position in the viewport.
 *   - Idle float: satellites drift +/-4-6px on staggered 4-7s loops, so the
 *     composition breathes with no scroll or pointer input.
 *   - Pointer lean: doubled to +/-5deg / +/-7deg.
 * One shared transform-only rAF loop, running only while a showcase is on
 * screen and the tab is visible. Touch devices and prefers-reduced-motion get
 * the static assembled tilt from CSS (the loop never starts, so the CSS resting
 * transform stands).
 */

(function () {
  "use strict";

  var showcases = Array.prototype.slice.call(document.querySelectorAll(".showcase"));
  if (!showcases.length) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var finePointer = window.matchMedia("(pointer: fine)");

  // Disassembly fan — per-satellite direction (order = paint order) so pieces
  // spread to distinct quadrants (choreographed, not chaotic). Magnitude scales
  // with each layer's depth; rotation lands on the closest (shallowest) pieces.
  var FAN = [
    { x: -1.00, y: -0.78, r: -6 },
    { x:  1.00, y: -0.55, r:  5 },
    { x: -0.85, y:  0.85, r: -5 },
    { x:  0.92, y:  0.62, r:  6 },
    { x:  0.10, y: -1.00, r:  4 },
    { x: -0.55, y:  0.45, r: -4 }
  ];

  var items = showcases.map(function (el) {
    var scene = el.querySelector(".sc-scene");
    var layerEls = Array.prototype.slice.call(el.querySelectorAll(".sc-layer"));
    var sat = 0;
    var layers = layerEls.map(function (l) {
      var z = parseFloat(getComputedStyle(l).getPropertyValue("--z")) || 0;
      var isBase = l.classList.contains("sc-base");
      var o = {
        el: l, z: z, isBase: isBase,
        dx: 0, dy: 0, rot: 0,
        // idle float: +/-4-6px, staggered period + phase per satellite
        amp: 4 + (sat % 3),
        omega: 6.2832 / (4000 + (sat % 4) * 900),
        phase: sat * 1.7
      };
      if (!isBase) {
        var depthN = Math.min(z, 160) / 160;      // 0..1
        var mag = 60 + depthN * 60;               // 60..120px
        var dir = FAN[sat % FAN.length];
        o.dx = dir.x * mag;
        o.dy = dir.y * mag;
        o.rot = dir.r * (z >= 100 ? 1 : 0.6);     // more rotation on the closest pieces
        sat++;
      }
      return o;
    });
    return {
      el: el, scene: scene, layers: layers,
      baseRx: parseFloat(getComputedStyle(scene).getPropertyValue("--rx")) || 6,
      baseRy: parseFloat(getComputedStyle(scene).getPropertyValue("--ry")) || -14,
      visible: false,
      // pointer lean state: target + eased current, both -1..1
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
    var now = performance.now();
    var any = false;
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (!it.visible) continue;
      any = true;

      // Showcase position through the viewport: -1 (below) .. 0 (centered) .. 1
      // (above). |p| is the disassembly amount — 0 assembled, 1 fully apart.
      var r = it.el.getBoundingClientRect();
      var p = (vh / 2 - (r.top + r.height / 2)) / vh;
      if (p < -1) p = -1; else if (p > 1) p = 1;
      var dis = Math.abs(p);

      // eased pointer lean, doubled coefficients (+/-5deg X, +/-7deg Y)
      it.cx += (it.tx - it.cx) * 0.08;
      it.cy += (it.ty - it.cy) * 0.08;
      it.scene.style.transform =
        "rotateX(" + (it.baseRx - it.cy * 5).toFixed(2) + "deg) " +
        "rotateY(" + (it.baseRy + it.cx * 7).toFixed(2) + "deg)";

      for (var j = 0; j < it.layers.length; j++) {
        var l = it.layers[j];
        if (l.isBase) continue; // base is the anchor — only the scene tilt moves it
        var floatY = Math.sin(now * l.omega + l.phase) * l.amp;
        var tx = l.dx * dis;
        var ty = l.dy * dis + floatY;
        var rz = l.rot * dis;
        l.el.style.transform =
          "translateZ(" + l.z + "px) translate(" +
          tx.toFixed(1) + "px," + ty.toFixed(1) + "px) rotate(" + rz.toFixed(2) + "deg)";
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
  }, { rootMargin: "140px 0px" });
  items.forEach(function (it) { io.observe(it.el); });

  document.addEventListener("visibilitychange", syncLoop);
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", syncLoop);
})();
