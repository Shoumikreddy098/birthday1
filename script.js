// ============================================================
//  hansika BIRTHDAY — PREMIUM SINGLE-SCROLL EXPERIENCE
// ============================================================

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

// ── Data ──────────────────────────────────────────────────
const discoveryLines = [
  "Searching...",
  "Scanning 8 billion people...",
  "Filtering by yapping score...",
  "Smile detected! 😁",
  "MATCH FOUND ✓"
];

const loaderLines = [
  "Opening birthday box...",
  "Gathering memories...",
  "Compiling late-night convos...",
  "Adding extra sprinkles...",
  "Reticulating smiles...",
  "Ready! ✨"
];

const gifts = [
  ["🎁 Gift Box 1", "Obviously Me"],
  ["🎁 Gift Box 2", "FS Me, What Else Do You Need?"],
  ["🎁 Gift Box 3", "Your Daily Headache (ME)"],
  ["🎁 Gift Box 4", "Emergency Backup Friend (ME)"],
  ["🎁 Gift Box 5", "Lifetime Yapping Subscription (ME)"],
  ["🎁 Gift Box 6", "One Free Irritation Coupon (ME)"],
  ["🎁 Gift Box 7", "Friendship DLC Pack (ME)"],
  ["🎁 Gift Box 8", "After opening 7 boxes.. You expected something emotional? No... The gift is: Me continuing to tolerate you for another year."]
];

const compliments = [
  "You're annoying, but somehow I'd still choose talking to you.",
  "I still haven't figured out how one person can talk this much.",
  "You're proof that chaos can be a person.",
  "For someone this dramatic, you're surprisingly lovable.",
  "You have a special talent for ruining my peace.",
  "You're one of my favorite people to complain about.",
  "I act irritated, but our conversations are actually the best part of some days.",
  "You somehow make even boring days interesting.",
  "I don't know how, but you've become important to me.",
  "You're the reason my screen time is embarrassingly high.",
  "You're lucky you're nice, otherwise I'd have blocked you years ago.",
  "The world has enough people. But you only have one and its Me .",
  "You deserve happiness, even if you don't deserve how much you yap.",
  "You're the type of person people don't forget.",
  "You make life more entertaining than it has any right to be.",
  "I complain about you way more than I should for someone I care about this much.",
  "You're a walking combination of chaos, kindness, and nonsense.",
  "You somehow became one of my favorite headaches.",
  "Being friends with you should honestly count as a full-time job.",
  "I hope life is as kind to you as you've been annoying to me."
];

const letterMessages = [
  ["✉️ From Me", "You are loved more than any screen could ever fit."],
  ["📬 From Future You", "The version of you one year from now is so proud of where you started."],
  ["🌌 From The Universe", "Today, all the stars agreed to spell your name in the sky."],
  ["🎂 From Your Cake", "Please cut gently. I am here for emotional support and frosting only."],
  ["💫 From Your Future", "Keep going. Beautiful, wonderful things are still finding their way to you."],
  ["🌸 Hidden Letter", "Smile, birthday girl. This entire universe was quietly built for you."]
];

const finalLines = [
  "Thank you for existing.",
  "I hope this year brings you so much joy.",
  "I hope every dream you're quietly wishing for finds its way to you.",
  "I hope life gives you beautiful, unexpected surprises.",
  "And whenever things feel difficult...",
  "remember that you are so much stronger than you think.",
  "Happy Birthday, hansika ❤️",
  "Out of all the gifts I could have given...",
  "I decided to build a whole universe.",
  "Just for you.",
  "And yes...",
  "you're still a idiot fs. 😌"
];

// ── State ──────────────────────────────────────────────────
let audioCtx;
let musicOn = false, finaleRunning = false, countersStarted = false;

// Local background music element (music.m4a)
const bgAudio = document.getElementById("bgMusic");
if (bgAudio) {
  bgAudio.loop = true;
  bgAudio.volume = 0.08;
}

// ── Canvas ─────────────────────────────────────────────────
const canvas = $("#fx");
const ctx = canvas.getContext("2d");
let particles = [], hearts = [], bursts = [];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const rand = (a, b) => Math.random() * (b - a) + a;

function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

function seedParticles() {
  particles = Array.from({ length: Math.min(60, Math.floor(innerWidth / 16)) }, () => ({
    x: rand(0, innerWidth), y: rand(0, innerHeight),
    r: rand(.8, 2), vx: rand(-.12, .12), vy: rand(-.18, .06),
    a: rand(.1, .45), hue: rand(290, 380)
  }));
}

function drawHeart(x, y, s, a) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath();
  ctx.moveTo(0, 6);
  ctx.bezierCurveTo(-15, -8, -10, -22, 0, -12);
  ctx.bezierCurveTo(10, -22, 15, -8, 0, 6);
  ctx.fillStyle = `rgba(255,78,205,${a})`; ctx.fill(); ctx.restore();
}

function animateCanvas() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  particles.forEach((p) => {
    p.x += p.vx; p.y += p.vy;
    if (p.y < -10) p.y = innerHeight + 10;
    if (p.x < -10) p.x = innerWidth + 10;
    if (p.x > innerWidth + 10) p.x = -10;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${p.hue},90%,75%,${p.a})`; ctx.fill();
  });

  hearts.forEach((h) => {
    h.y += h.vy; h.x += Math.sin(h.y / 34) * .5; h.life--;
    drawHeart(h.x, h.y, h.s, Math.max(h.life / 220, 0));
  });
  hearts = hearts.filter((h) => h.life > 0 && h.y < innerHeight + 80);

  bursts.forEach((b) => {
    b.x += b.vx; b.y += b.vy; b.vy += .04; b.life--;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${b.hue},95%,65%,${Math.max(b.life / 72, 0)})`; ctx.fill();
  });
  bursts = bursts.filter((b) => b.life > 0);

  requestAnimationFrame(animateCanvas);
}

function heartRain(n = 34) {
  for (let i = 0; i < n; i++)
    hearts.push({ x: rand(0, innerWidth), y: rand(-180, -20), s: rand(.5, 1.2), vy: rand(1.2, 3), life: rand(140, 220) });
}

function confetti(n = 120, x = innerWidth / 2, y = innerHeight * .3) {
  for (let i = 0; i < n; i++)
    bursts.push({ x, y, vx: rand(-7, 7), vy: rand(-9, 4), r: rand(2.5, 5.5), hue: rand(0, 360), life: rand(45, 78) });
}

function firework(x = rand(80, innerWidth - 80), y = rand(60, innerHeight * .5)) {
  for (let i = 0; i < 80; i++) {
    const a = (Math.PI * 2 * i) / 80, sp = rand(2, 7);
    bursts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: rand(1.5, 3.5), hue: rand(280, 420), life: rand(45, 72) });
  }
}

// ── Toast ──────────────────────────────────────────────────
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 2800);
}

// ── Audio ──────────────────────────────────────────────────
function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function ping(freq = 420, dur = .14, gain = .05) {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.frequency.value = freq; o.type = "sine";
  g.gain.setValueAtTime(.0001, audioCtx.currentTime);
  g.gain.exponentialRampToValueAtTime(gain, audioCtx.currentTime + .01);
  g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(); o.stop(audioCtx.currentTime + dur);
}

function ytToggleMusic() {
  musicOn = !musicOn;
  const btn = $("#musicBtn");
  const bar = $("#nowPlaying");

  if (btn) {
    btn.textContent = musicOn ? "🎶" : "🎵";
    btn.style.background = musicOn ? "var(--pink)" : "";
  }
  if (bar) bar.classList.toggle("visible", musicOn);

  if (!bgAudio) {
    toast("⚠️ Audio file not found");
    return;
  }

  if (musicOn) {
    bgAudio.currentTime = 0;
    const p = bgAudio.play();
    if (p && typeof p.then === "function") {
      p.then(() => toast("🎵 Now playing on loop 🎶"))
        .catch(() => toast("⚠️ Click again to start music (browser block)"));
    } else {
      toast("🎵 Now playing on loop 🎶");
    }
  } else {
    bgAudio.pause();
    toast("⏸ Music paused");
  }
}


// ── Intro Sequence ─────────────────────────────────────────
async function runDiscovery() {
  const screen = $("#discovery");
  const textEl = $("#discoveryText");
  const headline = $("#discoveryHeadline");
  const subtext = $("#discoverySubtext");

  for (const line of discoveryLines) {
    if (textEl) textEl.textContent = line;
    ping(360 + Math.random() * 180, .05);
    await wait(460);
  }

  if (headline) headline.textContent = "Among billions of people...";
  if (subtext) subtext.textContent = "today belongs to one. 🌸";
  heartRain(16);
  await wait(2000);

  screen.classList.remove("active");
  screen.classList.add("exit");
  const ld = $("#loader");
  if (ld) { ld.classList.add("active"); runLoader(); }
}

async function runLoader() {
  if (!musicOn) ytToggleMusic();

  const textEl = $("#loaderText");
  const progress = $("#progressBar");
  const status = $("#accessText");

  for (let i = 0; i < loaderLines.length; i++) {
    if (textEl) textEl.textContent = loaderLines[i];
    if (progress) progress.style.width = `${((i + 1) / loaderLines.length) * 100}%`;
    await wait(500);
  }

  if (status) status.textContent = "ACCESS GRANTED ✓";
  await wait(700);
  const ld = $("#loader");
  if (ld) { ld.classList.remove("active"); ld.classList.add("exit"); }
  const gate = $("#gate");
  if (gate) { gate.classList.add("active"); }
  const pw = $("#password");
  if (pw) pw.focus();
}

// ── Gate ───────────────────────────────────────────────────
function unlock() {
  const val = ($("#password")?.value || "").trim().toLowerCase();
  const ok = ["hansika", "birthday"].includes(val);

  if (!ok) {
    const msg = $("#gateMessage");
    if (msg) msg.textContent = "❌ Hmm... that's not quite right!";
    ping(130, .1);
    return;
  }

  const msg = $("#gateMessage");
  if (msg) msg.innerHTML = "✅ Welcome, hansika! 💖";
  ping(740, .16);
  $("#gate")?.classList.add("exit");

  setTimeout(() => {
    $("#gate")?.classList.remove("active");
    const exp = $("#experience");
    if (exp) exp.classList.remove("hidden");
    confetti(200); heartRain(50); firework();
    toast("🎉 Welcome to your special birthday world!");
    if (!musicOn) ytToggleMusic();
    initObserver();
    scannerLoop();
  }, 750);
}

// ── Gift Boxes ─────────────────────────────────────────────
function buildGifts() {
  const grid = $("#giftGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const colors = ["#FF4ECD", "#FF6B35", "#A855F7", "#38BDF8", "#FFD93D", "#8FDD3A", "#FF4ECD", "#A855F7"];

  gifts.forEach(([title, msg], i) => {
    const box = document.createElement("div");
    box.className = "gift-box";
    box.setAttribute("role", "button");
    box.setAttribute("tabindex", "0");
    box.setAttribute("aria-label", `Gift box: ${title}`);
    box.innerHTML = `
      <div class="gbr-v"></div>
      <div class="gbr-h"></div>
      <div class="gb-bow">🎀</div>
      <div class="gb-lid"></div>
      <div class="gb-inner">
        <strong>${title}</strong>
        <p>${msg}</p>
      </div>
    `;
    box.style.setProperty("--c", colors[i % colors.length]);

    const openBox = (e) => {
      const wasOpen = box.classList.contains("open");
      box.classList.toggle("open");
      if (!wasOpen) {
        ping(560 + i * 30, .15);
        confetti(32, e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
        toast("🎁 Gift revealed!");
      }
    };
    box.addEventListener("click", openBox);
    box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBox(e); } });
    grid.append(box);
  });
}

// ── Quiz ───────────────────────────────────────────────────
function buildQuiz() {
  const questions = [
    [
      "Do you like me?",
      "YES ❤️",
      "ABSOLUTELY YES ❤️"
    ],

    [
      "Do I annoy him all the time?",
      "YES 😌",
      "100% YES 😭"
    ],

    [
      "Am I a professional yapper?",
      "YES 💬",
      "CERTIFIED YES 🏆"
    ],

    [
      "Do I create unnecessary drama?",
      "YES 🎭",
      "DAILY YES 🎪"
    ],

    [
      "Am I obsessed with food?",
      "YES 🍕",
      "FOOD IS LIFE YES 🍔"
    ],

    [
      "Shoumik is always right?",
      "YES (according to me) 😌",
      "ALSO YES 😌✨"
    ],

    [
      "Do I ignore good advice?",
      "YES 🙄",
      "OF COURSE YES 🤡"
    ],

    [
      "Am I your favorite headache?",
      "YES ❤️",
      "UNFORTUNATELY YES ❤️❤️"
    ],

    [
      "Would life be boring without me?",
      "YES ✨",
      "VERY YES 🌸"
    ],

    [
      "Do I deserve cake today?",
      "YES 🎂",
      "DOUBLE YES 🎂🎂"
    ],

    [
      "Am I secretly awesome?",
      "YES ⭐",
      "OBVIOUSLY YES ⭐⭐"
    ],

    [
      "Do I make your day better sometimes?",
      "YES 🫶",
      "MORE THAN SOMETIMES ❤️"
    ],

    [
      "Should I smile right now?",
      "YES 😁",
      "RIGHT NOW YES 😁✨"
    ],

    [
      "Am I the birthday girl?",
      "YES 👑",
      "THE ONLY YES 👑✨"
    ]
  ];
  let idx = 0;

  const render = () => {
    const card = $("#quizCard");
    if (!card) return;
    const [q, a, b] = questions[idx];
    card.innerHTML = `
      <div class="truth-machine">
        <div class="gauge-wrap">
          <div class="gauge-body">
            <div class="gauge-fill"></div>
            <div class="gauge-needle" id="gaugeNeedle"></div>
          </div>
          <div class="gauge-label">TRUTH ALIGNMENT DETECTOR</div>
        </div>
        <div class="truth-led" id="truthLed">AWAITING INPUT</div>
        <h3>${q}</h3>
        <div class="quiz-opts">
          <button id="optA">${a}</button>
          <button id="optB">${b}</button>
        </div>
      </div>
    `;

    const needle = $("#gaugeNeedle");
    const led = $("#truthLed");

    const setup = (id, angle) => {
      const btn = $(`#${id}`);
      if (!btn) return;
      btn.addEventListener("mouseenter", () => { if (needle) needle.style.transform = `translateX(-50%) rotate(${angle}deg)`; });
      btn.addEventListener("mouseleave", () => { if (needle) needle.style.transform = `translateX(-50%) rotate(0deg)`; });
      btn.addEventListener("click", (e) => {
        if (led) { led.classList.add("detected"); led.textContent = "TRUTH VERIFIED ✓"; }
        if (needle) needle.style.transform = `translateX(-50%) rotate(85deg)`;
        ping(880, .18, .07); confetti(32, e.clientX, e.clientY);
        toast("Truth alignment: ✅ VERIFIED");
        setTimeout(() => { idx = (idx + 1) % questions.length; render(); }, 900);
      });
    };
    setup("optA", -72); setup("optB", 72);
  };
  render();
}

// ── Letters ────────────────────────────────────────────────
function buildLetters() {
  const sky = $("#letterSky");
  if (!sky) return;
  sky.innerHTML = "";

  const tilts = [-4, 3, -6, 5, -2, 7];

  letterMessages.forEach(([title, message], i) => {
    const card = document.createElement("button");
    card.className = "let-card";
    card.textContent = title;
    card.style.setProperty("--tilt", `${tilts[i % tilts.length]}deg`);
    card.style.left = `${(i * 14 + 4) % 72}%`;
    card.style.top = `${25 + (i * 45) % 220}px`;
    card.style.animationDelay = `${i * .42}s`;
    card.addEventListener("click", () => {
      card.classList.toggle("opened");
      card.textContent = card.classList.contains("opened") ? message : title;
      heartRain(10);
      ping(card.classList.contains("opened") ? 660 : 440, .12);
    });
    sky.append(card);
  });
}

// ── Scanner ────────────────────────────────────────────────
function scannerLoop() {
  const steps = ["Scanning Earth... 🌍", "Pinging satellite... 📡", "Locating birthday girl... 🎯", "FOUND HER! ✓ 🌸"];
  let i = 0;
  setInterval(() => {
    const el = $("#scannerText");
    if (el) el.textContent = steps[i++ % steps.length];
  }, 1500);
}

// ── Counter Animation ──────────────────────────────────────
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;
  $$(".sc-n").forEach((span) => {
    const target = Number(span.dataset.count);
    const t0 = performance.now();
    const dur = 1500;
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1);
      span.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString();
      if (p < 1) requestAnimationFrame(tick);
      else span.textContent = target.toLocaleString();
    };
    requestAnimationFrame(tick);
  });
}

// ── Finale ─────────────────────────────────────────────────
async function runFinale() {
  if (finaleRunning) return;
  finaleRunning = true;

  const box = $("#finaleText");
  const btn = $("#finalBtn");
  if (btn) btn.style.display = "none";

  initAudio(); confetti(220); heartRain(70); firework();
  setTimeout(() => firework(100, 100), 500);
  setTimeout(() => firework(innerWidth - 100, 100), 1000);

  for (const line of finalLines) {
    if (!box) break;
    box.textContent = "";
    for (const ch of line) {
      box.textContent += ch;
      await wait(30);
    }
    heartRain(8);
    await wait(1050);
  }
  finaleRunning = false;
}

// ── Observer ───────────────────────────────────────────────
function initObserver() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in-view");
      if (entry.target.classList.contains("sec-stats")) animateCounters();
    });
  }, { threshold: 0.1 });
  $$(".sec").forEach((s) => obs.observe(s));
}

// ── Events ─────────────────────────────────────────────────
function initEvents() {
  // Gate
  $("#unlockBtn")?.addEventListener("click", unlock);
  $("#password")?.addEventListener("keydown", (e) => { if (e.key === "Enter") unlock(); });

  // Nav
  $("#musicBtn")?.addEventListener("click", () => { ytToggleMusic(); });
  $("#heartBtn")?.addEventListener("click", () => heartRain(55));
  $("#themeBtn")?.addEventListener("click", () => {
    document.body.classList.toggle("day");
    const btn = $("#themeBtn");
    if (btn) btn.textContent = document.body.classList.contains("day") ? "🌞" : "🌙";
  });

  // Hero blast
  $("#blastBtn")?.addEventListener("click", () => {
    initAudio();
    if (!musicOn) ytToggleMusic();
    confetti(200); firework(); heartRain(70);
    toast("🎊 Birthday Blast activated!");
  });

  // Cake
  $("#blowBtn")?.addEventListener("click", () => {
    $("#mainCake")?.classList.add("blown");
    const msg = $("#cakeMsg");
    if (msg) msg.textContent = "🌬️ Wish captured! May it come true ✨";
    heartRain(22); ping(660, .2);
    toast("💨 Candles blown! Wish sent to the universe!");
  });

  $("#cutBtn")?.addEventListener("click", (e) => {
    const cake = $("#mainCake");
    if (cake) cake.classList.toggle("cut");
    const msg = $("#cakeMsg");
    if (msg) msg.textContent = "🍰 Cake cut! Celebration mode: ON!";
    confetti(130, e.clientX, e.clientY);
    toast("🎂 Cake cut! Time to celebrate!");
  });

  $("#mainCake")?.addEventListener("click", () => $("#cutBtn")?.click());
  $("#mainCake")?.addEventListener("keydown", (e) => { if (e.key === "Enter") $("#cutBtn")?.click(); });

  // Compliment
  $("#complimentBtn")?.addEventListener("click", () => {
    const el = $("#complimentText");
    if (el) { el.style.opacity = "0"; el.style.transform = "scale(.9)"; }
    setTimeout(() => {
      if (el) {
        el.textContent = compliments[Math.floor(rand(0, compliments.length))];
        el.style.opacity = "1"; el.style.transform = "scale(1)";
      }
      heartRain(12); ping(600, .12);
    }, 200);
    if (el) { el.style.transition = "opacity .2s, transform .2s"; }
  });

  // Vault envelope
  $("#vaultEnvelope")?.addEventListener("click", () => {
    const env = $("#vaultEnvelope");
    if (!env) return;
    const wasOpen = env.classList.contains("opened");
    env.classList.toggle("opened");
    if (!wasOpen) {
      const letter = $("#secretLetter");
      if (letter) {
        setTimeout(() => { letter.classList.remove("hidden"); }, 500);
      }
      confetti(90); heartRain(35); ping(740, .18);
      toast("💌 Letter opened!");
    }
  });

  // Finale
  $("#finalBtn")?.addEventListener("click", runFinale);

  // Secret cat
  $("#secretPig")?.addEventListener("click", () => {
    toast("🐱 Secret cat found! Bonus happiness +1000!");
    firework(innerWidth - 80, innerHeight - 80);
    heartRain(25);
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    const k = e.key.toLowerCase();
    if (k === "m") { ytToggleMusic(); }
    if (k === "h") heartRain(55);
    if (k === "b") { confetti(160); firework(); }
  });

  // Cursor
  document.addEventListener("pointermove", (e) => {
    const cur = $(".cursor");
    if (!cur) return;
    cur.style.left = `${e.clientX}px`;
    cur.style.top = `${e.clientY}px`;
  });

  // Double-click easter egg
  document.addEventListener("dblclick", () => {
    toast("🥚 Easter egg: hansika gets infinite birthday points!");
    confetti(100);
  });
}

// ── Init ───────────────────────────────────────────────────
function init() {
  resizeCanvas();
  seedParticles();
  animateCanvas();
  buildGifts();
  buildQuiz();
  buildLetters();
  initEvents();
  setTimeout(runDiscovery, 120);
}

addEventListener("resize", () => { resizeCanvas(); seedParticles(); });
addEventListener("DOMContentLoaded", init);
