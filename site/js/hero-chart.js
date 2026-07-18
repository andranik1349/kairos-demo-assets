/* Kairos hero chart — builds the simplified wheel inside #hero-wheel and runs
 * the hero's canvas starfield. Index page only; no-ops if the hero is absent.
 *
 * WheelCore below is derived from assets/masters/kairos-chart.html (lines
 * 358-632, the prototype's wheel_core.js). Removed for the hero: house band,
 * cusp spokes + numbers, ASC/DSC/MC/IC axes (client-approved), tooltip hit
 * areas + data attrs, and the date-switcher transition plumbing. Counter-
 * rotating glyphs are emitted inside a wrapper <g class="cr"> so the CSS
 * counter-spin animation (src/main.css, k-counterspin) never fights a base
 * transform: South Node's 180-degree flip lives as an SVG attribute on the
 * inner <use>, the animation lives on the wrapper.
 *
 * See docs/reference/chart-demo-notes.md for the prototype's architecture.
 */

(function () {
  "use strict";

  var wheelSvg = document.getElementById("hero-wheel");
  var hero = document.getElementById("hero");
  if (!wheelSvg || !hero) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ================= WheelCore (vendored, trimmed) ================= */

  var WheelCore = (function () {
    var C = 500;
    var R = {
      decoOuter: 488, decoInner: 472,
      zodOuter: 462, zodInner: 396, zodGlyph: 429,
      hub: 178,                                 // aspect hub ring (was houseInner)
      planetTick: 390, planetGlyph: 350,
      aspect: 178, centerGlow: 120
    };

    var SIGN_IDS = ["ARI","TAU","GEM","CAN","LEO","VIR","LIB","SCO","SAG","CAP","AQU","PIS"];

    var BODY_NAMES = {
      SO:"Sun", MO:"Moon", ME:"Mercury", VE:"Venus", MA:"Mars", JU:"Jupiter",
      SA:"Saturn", UR:"Uranus", NE:"Neptune", PL:"Pluto", NN:"North Node",
      CH:"Chiron", SN:"South Node"
    };

    var BODY_COLOR = {
      SO:"#ffd27a", MO:"#cdddff", ME:"#8fe6c4", VE:"#8be0c0", MA:"#ff7d6b",
      JU:"#ffc98a", SA:"#d8c79a", UR:"#8fd3ff", NE:"#88aaff", PL:"#bfa3ff",
      NN:"#aeb6d6", SN:"#9aa1bf", CH:"#c3a6ff", PF:"#0fb8ac"
    };

    var ASPECTS = {
      "-1-":{c:"#0fb8ac", g:"neutral"},
      "-2-":{c:"#ff6f6f", g:"hard"},
      "-3-":{c:"#39d6a6", g:"soft"},
      "-4-":{c:"#ff9a5c", g:"hard"},
      "-5-":{c:"#b98aff", g:"soft"},
      "-6-":{c:"#6f93ff", g:"soft"},
      "-8-":{c:"#d98a8a", g:"hard"},
      "-3/8-":{c:"#d98a8a", g:"hard"}
    };

    function deg2rad(d){ return d*Math.PI/180; }

    // ecliptic longitude -> SVG point, ASC pinned to 9 o'clock, zodiac CCW
    function toXY(e, r, ascDeg){
      var a = deg2rad(180 + (e - ascDeg));
      return { x: C + r*Math.cos(a), y: C - r*Math.sin(a) };
    }

    // collision spacing: keep display angles >= minSep apart on the circle
    function spaceAngles(items, minSep){
      var n = items.length;
      var order = items.map(function(it,i){return {i:i, e:((it.e%360)+360)%360};});
      order.sort(function(a,b){return a.e-b.e;});
      var disp = order.map(function(o){return o.e;});
      for(var pass=0; pass<200; pass++){
        var moved=false;
        for(var k=0;k<n;k++){
          var a=disp[k], b=disp[(k+1)%n];
          var gap=b-a; if(k+1===n) gap = (b+360)-a;
          if(gap<minSep){
            var push=(minSep-gap)/2 + 0.001;
            disp[k]=a-push;
            disp[(k+1)%n]=b+push;
            moved=true;
          }
        }
        if(!moved) break;
      }
      var out=new Array(n);
      for(var j=0;j<n;j++){ out[order[j].i] = ((disp[j]%360)+360)%360; }
      return out;
    }

    // Glyph <use>, optionally wrapped for continuous counter-rotation.
    // Base rotations (South Node's 180-degree flip) go on the inner element as
    // an SVG attribute; the animated wrapper starts at transform:none.
    function glyphUse(code, cx, cy, size, cls, cr){
      var h = size/2;
      var href = (code==="NN"||code==="SN") ? "#g-NODE" : ("#g-"+code);
      var base = (code==="SN") ? 180 : 0;
      var baseAttr = base ? ' transform="rotate('+base+' '+cx.toFixed(2)+' '+cy.toFixed(2)+')"' : '';
      var use = '<use href="'+href+'" x="'+(cx-h)+'" y="'+(cy-h)+'" width="'+size+'" height="'+size+'"'+baseAttr+' class="'+cls+'"/>';
      if(!cr) return use;
      return '<g class="cr" style="transform-box:view-box;transform-origin:'+cx.toFixed(2)+'px '+cy.toFixed(2)+'px">'+use+'</g>';
    }

    function buildScene(DATA){
      var asc = cpt(DATA,"ASC");
      var S = [];
      var sky = [];  // zodiac + aspects + halos + planets — spins together

      // decorative outer tick ring (own slow ambient spin)
      var ticks="";
      for(var t=0;t<120;t++){
        var ta=deg2rad(t*3);
        var rO=R.decoOuter, rI = (t%5===0)?R.decoInner-4:R.decoInner+4;
        ticks += '<line x1="'+(C+rO*Math.cos(ta)).toFixed(2)+'" y1="'+(C-rO*Math.sin(ta)).toFixed(2)+
                 '" x2="'+(C+rI*Math.cos(ta)).toFixed(2)+'" y2="'+(C-rI*Math.sin(ta)).toFixed(2)+'"/>';
      }
      S.push('<g class="deco-ring">'+ticks+'</g>');

      // ring outlines: zodiac band edges + the aspect hub
      S.push('<g class="rings">'+circle(R.zodOuter)+circle(R.zodInner)+circle(R.hub)+'</g>');

      // zodiac band: dividers + sign glyphs
      var zod="";
      for(var s=0;s<12;s++){
        var b=30*s;
        var pO=toXY(b,R.zodOuter,asc), pI=toXY(b,R.zodInner,asc);
        zod+='<line class="zdiv" x1="'+pO.x.toFixed(2)+'" y1="'+pO.y.toFixed(2)+'" x2="'+pI.x.toFixed(2)+'" y2="'+pI.y.toFixed(2)+'"/>';
        var g=toXY(b+15,R.zodGlyph,asc);
        zod+= glyphUse(null, g.x, g.y, 34, "sign-glyph", true).replace("#g-null","#g-"+SIGN_IDS[s]);
      }
      sky.push('<g class="zodiac">'+zod+'</g>');

      // aspect threads (caller pre-filters DATA.PlanetAsps)
      var pmap={}; (DATA.Planets||[]).forEach(function(p){pmap[p.Planet]=p.Degree;});
      var asp="";
      (DATA.PlanetAsps||[]).forEach(function(a){
        if(!(a.Planet1 in pmap)||!(a.Planet2 in pmap)) return;
        var meta=ASPECTS[a.Aspect]||{c:"#6f7da0",g:"soft"};
        var p1=toXY(pmap[a.Planet1],R.aspect,asc), p2=toXY(pmap[a.Planet2],R.aspect,asc);
        asp+='<line class="aspect" x1="'+p1.x.toFixed(2)+'" y1="'+p1.y.toFixed(2)+
             '" x2="'+p2.x.toFixed(2)+'" y2="'+p2.y.toFixed(2)+'" stroke="'+meta.c+'"/>';
      });
      sky.push('<g class="aspects">'+asp+'</g>');

      // planets
      var planets=(DATA.Planets||[]).filter(function(p){return p.Planet in BODY_NAMES;});
      var disp=spaceAngles(planets.map(function(p){return {e:p.Degree};}), 9.5);
      var halos="", glyphs="";
      planets.forEach(function(p,i){
        var col=BODY_COLOR[p.Planet]||"#cdddff";
        var truePt=toXY(p.Degree, R.planetTick, asc);
        var tickIn=toXY(p.Degree, R.planetTick-12, asc);
        var gp=toXY(disp[i], R.planetGlyph, asc);
        var retro=(p.Speed||0)<0;
        halos+='<circle class="halo" data-code="'+p.Planet+'" cx="'+gp.x.toFixed(2)+'" cy="'+gp.y.toFixed(2)+
               '" r="40" fill="url(#halo-'+p.Planet+')"/>';
        glyphs+='<line class="pconn" x1="'+truePt.x.toFixed(2)+'" y1="'+truePt.y.toFixed(2)+
                '" x2="'+gp.x.toFixed(2)+'" y2="'+gp.y.toFixed(2)+'"/>';
        glyphs+='<line class="ptick" x1="'+truePt.x.toFixed(2)+'" y1="'+truePt.y.toFixed(2)+
                '" x2="'+tickIn.x.toFixed(2)+'" y2="'+tickIn.y.toFixed(2)+'" stroke="'+col+'"/>';
        glyphs+='<g class="planet" data-code="'+p.Planet+'" style="--pc:'+col+'">';
        glyphs+='<circle class="pcore" cx="'+gp.x.toFixed(2)+'" cy="'+gp.y.toFixed(2)+'" r="5.2" fill="'+col+'"/>';
        glyphs+= glyphUse(p.Planet, gp.x, gp.y-1, 46, "planet-glyph", true);
        if(retro){
          glyphs+='<g class="cr" style="transform-box:view-box;transform-origin:'+(gp.x+22).toFixed(2)+'px '+(gp.y-19).toFixed(2)+'px">'
                 +'<text class="retro" x="'+(gp.x+22).toFixed(2)+'" y="'+(gp.y-19).toFixed(2)+'">℞</text></g>';
        }
        glyphs+='</g>';
      });

      // Lot of Fortune marker at its degree
      var pf=cpt(DATA,"PF");
      if(pf!=null){
        var fp=toXY(pf, R.planetGlyph, asc);
        halos+='<circle class="halo" data-code="PF" cx="'+fp.x.toFixed(2)+'" cy="'+fp.y.toFixed(2)+'" r="26" fill="url(#halo-PF)"/>';
        glyphs+='<g class="planet part" data-code="PF" style="--pc:#0fb8ac">'
          +'<g class="cr" style="transform-box:view-box;transform-origin:'+fp.x.toFixed(2)+'px '+fp.y.toFixed(2)+'px">'
          +'<circle cx="'+fp.x.toFixed(2)+'" cy="'+fp.y.toFixed(2)+'" r="8.5" fill="none" stroke="#0fb8ac" stroke-width="1.4"/>'
          +'<line x1="'+(fp.x-8.5).toFixed(2)+'" y1="'+fp.y.toFixed(2)+'" x2="'+(fp.x+8.5).toFixed(2)+'" y2="'+fp.y.toFixed(2)+'" stroke="#0fb8ac" stroke-width="1.4"/>'
          +'<line x1="'+fp.x.toFixed(2)+'" y1="'+(fp.y-8.5).toFixed(2)+'" x2="'+fp.x.toFixed(2)+'" y2="'+(fp.y+8.5).toFixed(2)+'" stroke="#0fb8ac" stroke-width="1.4"/></g></g>';
      }

      sky.push('<g class="halos">'+halos+'</g>');
      sky.push('<g class="planets">'+glyphs+'</g>');
      S.push('<g id="sky" style="transform-box:view-box;transform-origin:500px 500px">'+sky.join("\n")+'</g>');

      // gradient defs for halos
      var defs='<defs>';
      Object.keys(BODY_COLOR).forEach(function(code){
        var c=BODY_COLOR[code];
        defs+='<radialGradient id="halo-'+code+'"><stop offset="0%" stop-color="'+c+'" stop-opacity="0.55"/>'
            +'<stop offset="35%" stop-color="'+c+'" stop-opacity="0.20"/>'
            +'<stop offset="100%" stop-color="'+c+'" stop-opacity="0"/></radialGradient>';
      });
      defs+='</defs>';

      return { defs: defs, content: S.join("\n") };

      function circle(r){ return '<circle class="ring" cx="500" cy="500" r="'+r+'"/>'; }
    }

    function cpt(DATA, code){
      var arr=DATA.CPoints||[];
      for(var i=0;i<arr.length;i++){ if(arr[i].CPoint===code) return arr[i].Degree; }
      return null;
    }

    return { buildScene: buildScene };
  })();

  /* ================= chart data =================
   * Snapshot from the prototype (get_horoscope shape), trimmed to what the
   * hero renders: planets, planet aspects, ASC (rotation anchor) + PF. */

  var DATA = {
    "Planets":[
      {"Planet":"SO","Degree":338.6,"Speed":1.00471},
      {"Planet":"MO","Degree":103.5,"Speed":14.11162},
      {"Planet":"ME","Degree":352.5,"Speed":-0.14388},
      {"Planet":"VE","Degree":350.9,"Speed":1.2474},
      {"Planet":"MA","Degree":327.3,"Speed":0.78798},
      {"Planet":"JU","Degree":105.3,"Speed":-0.03898},
      {"Planet":"SA","Degree":1.5,"Speed":0.11834},
      {"Planet":"UR","Degree":57.7,"Speed":0.02013},
      {"Planet":"NE","Degree":1.0,"Speed":0.03562},
      {"Planet":"PL","Degree":304.5,"Speed":0.02755},
      {"Planet":"NN","Degree":339.1,"Speed":-0.05292},
      {"Planet":"CH","Degree":24.0,"Speed":0.04565},
      {"Planet":"SN","Degree":159.1,"Speed":-0.05292}
    ],
    "PlanetAsps":[
      {"Planet1":"MO","Planet2":"SO","Aspect":"-3-","Orbis":5},
      {"Planet1":"MO","Planet2":"VE","Aspect":"-3-","Orbis":7},
      {"Planet1":"MO","Planet2":"MA","Aspect":"-3/8-","Orbis":1},
      {"Planet1":"MO","Planet2":"JU","Aspect":"-1-","Orbis":2},
      {"Planet1":"MO","Planet2":"UR","Aspect":"-8-","Orbis":1},
      {"Planet1":"MO","Planet2":"NN","Aspect":"-3-","Orbis":4},
      {"Planet1":"VE","Planet2":"ME","Aspect":"-1-","Orbis":2},
      {"Planet1":"JU","Planet2":"SO","Aspect":"-3-","Orbis":7},
      {"Planet1":"JU","Planet2":"VE","Aspect":"-3-","Orbis":6},
      {"Planet1":"UR","Planet2":"MA","Aspect":"-4-","Orbis":0},
      {"Planet1":"NE","Planet2":"SA","Aspect":"-1-","Orbis":1},
      {"Planet1":"PL","Planet2":"VE","Aspect":"-8-","Orbis":1},
      {"Planet1":"PL","Planet2":"SA","Aspect":"-6-","Orbis":3},
      {"Planet1":"NN","Planet2":"SO","Aspect":"-1-","Orbis":1},
      {"Planet1":"CH","Planet2":"SO","Aspect":"-8-","Orbis":0},
      {"Planet1":"SN","Planet2":"SO","Aspect":"-2-","Orbis":1}
    ],
    "CPoints":[
      {"CPoint":"ASC","Degree":318.7},
      {"CPoint":"PF","Degree":193.8}
    ]
  };

  // Decorative restraint: majors only, tightest orbs first, capped count.
  var HERO_MAJOR_ASPECTS = ["-1-","-2-","-3-","-4-","-6-"];
  var HERO_ASPECT_COUNT = 7;
  function filterAspects(data){
    var kept = (data.PlanetAsps||[])
      .filter(function(a){ return HERO_MAJOR_ASPECTS.indexOf(a.Aspect) !== -1; })
      .sort(function(a,b){ return a.Orbis - b.Orbis; })
      .slice(0, HERO_ASPECT_COUNT);
    var out = {};
    for (var k in data) out[k] = data[k];
    out.PlanetAsps = kept;
    return out;
  }

  /* ================= scene injection ================= */

  var scene = WheelCore.buildScene(filterAspects(DATA));
  var coreGlow = '<defs><radialGradient id="coreG"><stop offset="0%" stop-color="#0fb8ac" stop-opacity="0.18"/>'
    + '<stop offset="55%" stop-color="#123" stop-opacity="0.05"/><stop offset="100%" stop-color="#000" stop-opacity="0"/></radialGradient></defs>';
  wheelSvg.innerHTML = coreGlow + scene.defs
    + '<circle class="core" cx="500" cy="500" r="300"/>'
    + scene.content;

  // group fade-in flags + planet entrance stagger (desync the halo pulses)
  [".deco-ring", ".rings", ".zodiac", ".aspects", ".halos"].forEach(function(sel){
    var g = wheelSvg.querySelector(sel); if (g) g.classList.add("fade");
  });
  wheelSvg.querySelectorAll(".planet").forEach(function(p, i){
    p.style.transitionDelay = (1.0 + i*0.07) + "s";
    var code = p.getAttribute("data-code");
    var halo = wheelSvg.querySelector('.halo[data-code="' + code + '"]');
    if (halo) halo.style.animationDelay = (-i*0.6) + "s";
  });

  /* ================= starfield ================= */

  var cv = document.getElementById("hero-stars");
  if (cv) {
    var ctx = cv.getContext("2d");
    var stars = [], W = 0, H = 0;
    var STAR_TINT = ["#ffffff","#ffffff","#ffffff","#cfe0ff","#bfe9e2","#ffe6c2"];

    var resize = function(){
      var small = window.innerWidth < 560;
      var dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(Math.round(W * H / (small ? 14000 : 8500)), 220);
      stars = Array.from({length: n}, function(){
        return {
          x: Math.random()*W, y: Math.random()*H,
          r: Math.random()*1.3 + .2, b: Math.random(), s: Math.random()*.5 + .25,
          t: STAR_TINT[Math.floor(Math.random()*STAR_TINT.length)],
          dx: (Math.random()-.5)*.02, dy: (Math.random()-.5)*.02
        };
      });
      if (reduceMotion.matches) drawFrame(0);
    };

    // One frame. dt>0 advances twinkle/drift; dt=0 renders the static state.
    var drawFrame = function(dt){
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++){
        var st = stars[i];
        if (dt > 0){
          st.b += st.s * dt * 0.001;
          st.x += st.dx; st.y += st.dy;
          if (st.x < 0) st.x += W; if (st.x > W) st.x -= W;
          if (st.y < 0) st.y += H; if (st.y > H) st.y -= H;
        }
        ctx.globalAlpha = 0.35 + 0.45 * (0.5 + 0.5 * Math.sin(st.b * 2));
        ctx.fillStyle = st.t;
        ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 7); ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    // rAF loop runs only while the hero is on screen, the tab is visible,
    // and the visitor hasn't asked for reduced motion.
    var rafId = null, t0 = 0, heroVisible = true;
    var tick = function(now){
      drawFrame(now - t0); t0 = now;
      rafId = requestAnimationFrame(tick);
    };
    var syncLoop = function(){
      var shouldRun = heroVisible && !document.hidden && !reduceMotion.matches;
      if (shouldRun && rafId === null){
        t0 = performance.now();
        rafId = requestAnimationFrame(tick);
      } else if (!shouldRun && rafId !== null){
        cancelAnimationFrame(rafId); rafId = null;
        if (reduceMotion.matches) drawFrame(0);
      }
    };

    if ("IntersectionObserver" in window){
      new IntersectionObserver(function(entries){
        heroVisible = entries[0].isIntersecting;
        syncLoop();
      }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener("visibilitychange", syncLoop);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", syncLoop);
    window.addEventListener("resize", resize);

    resize();
    syncLoop();
  }

  /* ================= entrance ================= */

  // Double-rAF so initial styles are committed before transitions arm.
  // Scoped to the hero section; under reduced motion the CSS forces the
  // finished state regardless, so adding the class is harmless.
  requestAnimationFrame(function(){
    requestAnimationFrame(function(){ hero.classList.add("loaded"); });
  });
})();
