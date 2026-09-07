"use strict";

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const escf = s => String(s).replace(/"/g,"&quot;");

// ═══ STATE ═══
const S = {
  screen: "landing",
  completed: new Set(),
  // C1
  c1: { selectedProblem: null, selectedAudience: null, stepIdx: 0, steps: [], answers: [] },
  // C2
  c2: { scenario: 0, decided: false, decisions: [], canChange: false },
  // C3
  c3: { step: 0, choices: [] },
  // C4
  c4: { persona: 0, choices: [] },
  // Name
  playerName: ""
};

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(id).classList.add("active");
  S.screen = id;
  if (id === "menuScreen") initMenu();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ═══ LANDING ═══
function initLanding() {
  $("landingTitle").textContent = G.landing.title;
  $("landingSub").textContent = G.landing.subtitle;
  $("entrepreneursGrid").innerHTML = G.landing.entrepreneurs.map(e => `
    <div class="e-card" style="--pc:${e.accent}" data-tilt data-magnetic>
      <div class="e-portrait">
        <img src="${esc(e.img)}" alt="${esc(e.name)}"
             onerror="this.style.opacity=0;this.nextElementSibling.style.opacity=1">
        <div class="e-fallback" style="opacity:0;position:absolute;inset:0;display:grid;place-items:center;font-size:3rem;font-weight:900">${escf(e.name[0])}</div>
        <div class="e-mask"></div>
        <div class="e-overlay">
          <div class="e-name">${esc(e.name)}</div>
          <div class="e-company">${esc(e.company)}</div>
          <div class="e-tags">${e.tags.map(t=>`<span class="e-tag">${esc(t)}</span>`).join("")}</div>
        </div>
      </div>
    </div>
  `).join("");
}

// ═══ ABOUT ═══
function initAbout() {
  const a = G.about;
  $("aboutTitle").textContent = a.title;
  $("aboutIntro").textContent = a.intro;

  $("aboutVision").innerHTML = `<div class="ab-icon">🎯</div><div><strong>رؤيتنا</strong><p>${esc(a.vision)}</p></div>`;
  $("aboutMission").innerHTML = `<div class="ab-icon">🚀</div><div><strong>رسالتنا</strong><p>${esc(a.mission)}</p></div>`;

  $("aboutGoals").innerHTML = a.goals.map(g => `<li>${esc(g)}</li>`).join("");

  $("aboutDepts").innerHTML = a.depts.map((d, di) => `
    <div class="dept-card" onclick="this.classList.toggle('open')">
      <div class="dept-head">
        <span class="dept-icon">${d.icon}</span>
        <div>
          <div class="dept-name">${esc(d.name)}</div>
          <div class="dept-desc">${esc(d.desc)}</div>
        </div>
        <span class="dept-arrow">▾</span>
      </div>
      <div class="dept-comm">
        ${d.committees.map(c => `
          <div class="comm-item">
            <div class="comm-name">• ${esc(c.name)}</div>
            <div class="comm-desc">${esc(c.desc)}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  $("aboutFlexible").textContent = a.flexible;
}

// ═══ MENU ═══
const JOURNEY = [
  { id: "c1", label: "الاكتشاف", icon: "🎯" },
  { id: "c2", label: "القرار", icon: "⚡" },
  { id: "c3", label: "الابتكار", icon: "🏪" },
  { id: "c4", label: "فهم العميل", icon: "💬" },
  { id: "type", label: "شخصيتك", icon: "🚀" }
];

function renderJourney(activeId) {
  const el = $("menuJourney");
  if (!el) return;
  const activeIdx = JOURNEY.findIndex(j => j.id === activeId);
  el.innerHTML = JOURNEY.map((j, i) => {
    let cls = "j-step";
    if (i < activeIdx) cls += " done";
    else if (i === activeIdx) cls += " active";
    const conn = i < JOURNEY.length - 1 ? `<span class="j-conn ${i < activeIdx ? 'done' : ''}"></span>` : "";
    return `<span class="${cls}"><span class="jp"></span>${esc(j.label)}</span>${conn}`;
  }).join("");
}

function initMenu() {
  renderJourney(-1);
  $("challengesGrid").innerHTML = G.challenges.map(c => `
    <div class="ch-card" style="--c:${c.color}" onclick="startChallenge('${c.id}')" data-tilt>
      <div class="ch-num">${String(c.number).padStart(2,"0")}</div>
      <div class="ch-icon">${c.icon}</div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <div class="ch-meta">
        <span class="diff-badge ${c.diff === 'متوسط' ? 'easy' : c.diff === 'صعب' ? 'med' : 'hard'}">${esc(c.diff)}</span>
        <span class="meta-chip">⏱️ ${esc(c.time)}</span>
        ${S.completed.has(c.id) ? '<span class="meta-chip done-badge">✓ مكتمل</span>' : ''}
      </div>
    </div>
  `).join("");
}

// ═══ START CHALLENGE ═══
function startChallenge(id) {
  if ($("menuJourney")) renderJourney(id);
  switch(id) {
    case "c1": startC1(); break;
    case "c2": startC2(); break;
    case "c3": startC3(); break;
    case "c4": startC4(); break;
  }
}

// ═══════════════════════════════════════════
// C1: PROBLEM + AUDIENCE + INNOVATION
// ═══════════════════════════════════════════
function startC1() {
  S.c1 = { selectedProblem: null, selectedAudience: null, stepIdx: 0, steps: [], answers: [] };
  showScreen("c1Screen");
  $("c1Title").textContent = G.c1.title;
  $("c1Problems").innerHTML = G.c1.problems.map(p => `
    <div class="sel-card" onclick="selectC1('problem',${p.id},this)">
      <div class="sel-icon">${p.icon}</div>
      <div class="sel-title">${esc(p.title)}</div>
      <div class="sel-desc">${esc(p.desc)}</div>
    </div>
  `).join("");
  $("c1Audiences").innerHTML = G.c1.audiences.map(a => `
    <div class="sel-card" onclick="selectC1('audience',${a.id},this)">
      <div class="sel-icon">${a.icon}</div>
      <div class="sel-title">${esc(a.title)}</div>
      <div class="sel-desc">${esc(a.desc)}</div>
    </div>
  `).join("");
  $("c1Step1").style.display = "block";
  $("c1Step2").style.display = "none";
  $("c1Step3").style.display = "none";
}

function selectC1(type, id, el) {
  document.querySelectorAll(`.sel-card`).forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  if (type === "problem") S.c1.selectedProblem = G.c1.problems.find(p => p.id === id);
  else S.c1.selectedAudience = G.c1.audiences.find(a => a.id === id);

  if (S.c1.selectedProblem && S.c1.selectedAudience) {
    $("c1Step1").style.display = "none";
    $("c1Step2").style.display = "block";
    $("c1Preview").innerHTML = `
      <div class="preview-item">
        <span class="preview-icon">${S.c1.selectedProblem.icon}</span>
        <span class="preview-text">${esc(S.c1.selectedProblem.title)}</span>
      </div>
      <span class="preview-plus">×</span>
      <div class="preview-item">
        <span class="preview-icon">${S.c1.selectedAudience.icon}</span>
        <span class="preview-text">${esc(S.c1.selectedAudience.title)}</span>
      </div>
    `;
  }
}

function startC1Challenge() {
  $("c1Step2").style.display = "none";
  $("c1Step3").style.display = "block";
  const scen = getC1Scenario();
  if (!scen) { alert("اختر مشكلة وجمهورًا أولًا"); return; }
  S.c1.steps = scen.steps;
  S.c1.stepIdx = 0;
  S.c1.answers = [];
  renderC1Step();
}

function getC1Scenario() {
  const p = S.c1.selectedProblem;
  const a = S.c1.selectedAudience;
  if (!p || !a) return null;
  const key = p.id + "_" + a.id;
  const authored = G.c1.scenarios[key];
  if (authored) {
    const core = { hint: authored.hint, question: authored.question, options: authored.options };
    return { steps: buildC1Steps(p, a, core) };
  }
  return buildFallbackScenario(p, a);
}

function mkC1Op(text, desc, feedback, best, points) {
  return { text, desc, feedback, best, points };
}

// 5-step dynamic journey: فهم المشكلة → فهم الجمهور → توليد الحل → تنفيذ الحل → القرار النهائي
// Core step (توليد الحل) is the authored combo-specific question from G.c1.scenarios
function buildC1Steps(p, a, core) {
  const P = p.title, A = a.title;
  const pf = p.facet || "المشكلة", ab = a.barrier || "الحاجز اليومي";

  const q1 = {
    label: "فهم المشكلة",
    q: `ما أول ما يجب أن تفهمه عن مشكلة "${P}" من منظور ${A}؟`,
    hint: `انظر إلى الجذر العملي: ${pf}.`,
    options: [
      mkC1Op("أنها مشكلة يومية تترافق مع حياة هؤلاء", `تُقاس "${P}" بأسبوع ${A} وعاداتهم المعتادة`, "إصابة دقيقة — فهم اليومي هو مدخل الحل الصحيح", true, 5),
      mkC1Op("أنها مسؤولية جهات أكبر من الأفراد", "حلها يحتاج نظامًا لا فردًا", "جزئيًا صحيح — لكن الانتظار يوقفك قبل البدء", false, 3),
      mkC1Op("أنها حالة وعي تكفيها التوعية", "المعلومة وحدها تحرك الجمهور", "التوعية لا تصنع سلوكًا مستمرًا بلا أداة عملية", false, 2),
      mkC1Op("أنها لا تمس حياة هذا الجمهور", `المشكلة بعيدة عن ${A}`, "تجاهل الجمهور يقضي على أي حل مقبول", false, 1)
    ]
  };

  const q2 = {
    label: "فهم الجمهور",
    q: `ما أكبر عائق يمنع ${A} من الانخراط في حل "${P}"؟`,
    hint: `اكتشف العائق الحقيقي: ${ab}.`,
    options: [
      mkC1Op(`${A} لا يملكون قناة سهلة تصلهم بالحل`, "الحل موجود لكن الوصول إليه متعب", "ممتاز — إزالة العائق أهم من زيادة الحوافز", true, 5),
      mkC1Op("لا ثقة لديهم بالحلول الجديدة", "خوف من المجهول أو تجارب سابقة", "صحيح — الثقة تُبنى بتجارب صغيرة ناجحة", false, 4),
      mkC1Op("العائق ضعف الوعي العام", "يحتاجون شرحًا أوسع أولًا", "الوعي مطلوب لكنه لا يكفي لدفعهم للمشاركة", false, 3),
      mkC1Op(`${A} لا يهمهم الأمر إطلاقًا`, "المشكلة لا تمسهم وجدانًا", "قِس احتياجهم الفعلي ولا تفترضه", false, 1)
    ]
  };

  const q3 = { label: "توليد الحل", hint: core.hint, q: core.question, options: core.options };

  const q4 = {
    label: "تنفيذ الحل",
    q: `لتنفيذ حل "${P}" مع ${A}، ما أنجح طريقة للاختبار قبل التوسع؟`,
    hint: "ابدأ صغيرًا وجرّب سريعًا ودع الجمهور يصحح الاتجاه.",
    options: [
      mkC1Op("نموذج مصغّر مع عيّنة صغيرة من الجمهور", `تجربة محدودة تقيس أثر "${P}" قبل التوسع`, "ممتاز — التجربة المصغّرة أسرع طريق لنتيجة آمنة", true, 5),
      mkC1Op("تحالف مع شركاء محليين يدعمون التنفيذ", "شركاء يقللون الكلفة ويرفعون المصداقية", "جيد — الشراكات تمنح الحل استمرارية", false, 4),
      mkC1Op("انطلاقة شاملة لكل الجمهور دفعة واحدة", "حل كامل التوسع من اليوم الأول", "مخاطرة عالية — الفشل الكبير يبدأ بانطلاق مكلف", false, 2),
      mkC1Op("الاستمرار بالدراسة وتحسين الفكرة فقط", "تأجيل التنفيذ حتى اكتمال الظروف", "التأجيل الطويل يقتل الزخم — جرّب بأدلة صغيرة", false, 1)
    ]
  };

  const q5 = {
    label: "القرار النهائي",
    q: `ما قرارك النهائي لتحويل حل "${P}" إلى واقع يلمسه ${A}؟`,
    hint: "القرار الجيد قابل للبدء خلال أسبوع وله مقياس أثر واضح.",
    options: [
      mkC1Op("بدء نسخة أولى خلال أسبوع مع مقياس أثر", `خطة زمنية واضحة تُظهر أثر "${P}" على ${A}`, "ممتاز — الوقت والقياس يحولان الفكرة إلى واقع", true, 5),
      mkC1Op("تكوين فريق صغير يتبنى التنفيذ", "توزيع المسؤولية على الملتزمين", "جيد — الفريق يحول الحماس إلى استمرارية", false, 4),
      mkC1Op("تأمين التمويل أولًا قبل أي خطوة", "تغطية الكلفة قبل البدء", "قد تتأخر طويلًا — البدء الصغير يقلص الحاجة للتمويل", false, 2),
      mkC1Op("ترك الأمر لأصحاب القرار الكبار وحدهم", "لا دور للأفراد في تنفيذه", "كل حل عظيم بدأ بمبادرة فردية صغيرة", false, 1)
    ]
  };

  return [q1, q2, q3, q4, q5];
}

function buildFallbackScenario(p, a) {
  const core = {
    hint: `تلميح: فكّر في حل عملي يرتبط بمشكلة "${p.title}" ويناسب جمهور "${a.title}".`,
    question: `ما الحل الابتكاري الذي يعالج "${p.title}" ويُلائم "${a.title}"؟`,
    options: [
      mkC1Op("تصميم حل يشرك الجمهور في الحل نفسه", `يستثمر قدرات ${a.title} في معالجة ${p.title}`, "حل مناسب: يوجّه قوة الجمهور مباشرة نحو جوهر المشكلة", true, 5),
      mkC1Op("برنامج توعية واسع", `حملة توعية عن ${p.title} تستهدف ${a.title}`, "مقبول: التوعية قاعدة لكنها لا تصنع تغييرًا عمليًا", false, 3),
      mkC1Op("تطبيق تقني متكامل", `حل رقمي ببيئة ملائمة لـ${a.title}`, "الاعتماد على التقنية وحدها يفشل مع جماهير واسعة", false, 2),
      mkC1Op("عدم البدء وانتظار المبادرات الكبرى", "ترك المبادرة للجهات الكبيرة", "التسويف ليس خيارًا — الحلول تبدأ صغيرة", false, 0)
    ]
  };
  return { steps: buildC1Steps(p, a, core) };
}

function renderC1Step() {
  const steps = S.c1.steps;
  if (!steps || !steps.length) return;
  const p = S.c1.selectedProblem;
  const a = S.c1.selectedAudience;
  const idx = S.c1.stepIdx;
  const step = steps[idx];
  const isLast = idx === steps.length - 1;
  const ans = S.c1.answers[idx];
  const dots = steps.map((_, i) => `<span class="c1-dot ${i < idx ? 'done' : ''} ${i === idx ? 'active' : ''}"></span>`).join("");
  $("c1QuestionArea").innerHTML = `
    <div class="c1-q-card">
      <div class="c1-summary">
        <div class="c1-sum-title">🧩 تحديك الآن</div>
        <div class="c1-sum-row">
          <span class="c1-sum-icon">${p ? p.icon : "🎯"}</span>
          <span class="c1-sum-text"><b>المشكلة:</b> ${esc(p ? p.title : "")}</span>
        </div>
        <div class="c1-sum-row">
          <span class="c1-sum-icon">${a ? a.icon : "👥"}</span>
          <span class="c1-sum-text"><b>الجمهور:</b> ${esc(a ? a.title : "")}</span>
        </div>
        <div class="c1-sum-cta">هل تستطيع ابتكار حل يناسب الاثنين؟</div>
      </div>
      <div class="c1-progress">
        <div class="c1-progress-label">${esc(step.label)} · السؤال ${idx + 1} من ${steps.length}</div>
        <div class="c1-dots">${dots}</div>
      </div>
      <div class="c1-hint">${esc(step.hint)}</div>
      <h3 class="c1-question">${esc(step.q)}</h3>
      <div class="c1-options">
        ${step.options.map((o, i) => {
          let cls = "c1-opt";
          if (ans) {
            cls += " selected";
            if (o.best) cls += " correct";
            if (i === ans.optIdx && !o.best) cls += " wrong";
          }
          return `<button class="${cls}" ${ans ? 'disabled' : ''} onclick="answerC1(${i})">
            <div class="c1-opt-title">${esc(o.text)}</div>
            <div class="c1-opt-desc">${esc(o.desc)}</div>
          </button>`;
        }).join("")}
      </div>
      ${ans ? `
        <div class="feedback-box ${step.options[ans.optIdx].best ? 'good' : 'bad'}">
          <div class="fb-icon">${step.options[ans.optIdx].best ? '✅' : '❌'}</div>
          <div class="fb-text">${esc(step.options[ans.optIdx].feedback)}</div>
        </div>
      ` : `<div id="c1Feedback"></div>`}
      <div id="c1Actions" ${ans ? '' : 'style="display:none"'}>
        ${idx > 0 ? `<button class="btn-outline btn-sm" onclick="backC1Step()">→ السابق</button>` : ''}
        ${isLast
          ? `<button class="btn-primary btn-sm" onclick="finishC1()">النتيجة النهائية ←</button>`
          : `<button class="btn-primary btn-sm" onclick="nextC1Step()">التالي ←</button>`}
      </div>
    </div>
  `;
}

function answerC1(optIdx) {
  const idx = S.c1.stepIdx;
  const step = S.c1.steps[idx];
  S.c1.answers[idx] = { optIdx, points: step.options[optIdx].points };
  renderC1Step();
}

function nextC1Step() {
  if (S.c1.stepIdx < S.c1.steps.length - 1) {
    S.c1.stepIdx++;
    renderC1Step();
  } else {
    finishC1();
  }
}

function backC1Step() {
  if (S.c1.stepIdx > 0) {
    S.c1.stepIdx--;
    renderC1Step();
  }
}

function finishC1() {
  S.completed.add("c1");
  showFinalResult();
}

// ═══════════════════════════════════════════
// C2: PRESSURE DECISIONS
// ═══════════════════════════════════════════
function startC2() {
  S.c2 = { scenario: 0, decided: false, decisions: [], canChange: false };
  showScreen("c2Screen");
  renderC2Scenario(0);
}

function renderC2Scenario(idx) {
  const sc = G.c2.scenarios[idx];
  if (!sc) { finishC2(); return; }
  S.c2.decided = false;
  S.c2.canChange = false;
  $("c2Title").textContent = `الموقف ${idx + 1} من ${G.c2.scenarios.length}`;
  $("c2Area").innerHTML = `
    <div class="c2-scenario">
      <div class="c2-alert">🚨 أمامك دقيقة لاتخاذ القرار</div>
      <h3 class="c2-sit-title">${esc(sc.title)}</h3>
      <p class="c2-situation">${esc(sc.situation)}</p>
      <div class="c2-hint">${esc(sc.hint)}</div>
      <div class="c2-options">
        ${sc.options.map((o, i) => `
          <button class="c2-opt" id="c2opt${i}" onclick="decideC2(${idx},${i})">
            <div class="c2-opt-text">${esc(o.text)}</div>
            <div class="c2-opt-desc">${esc(o.desc)}</div>
          </button>
        `).join("")}
      </div>
      <div id="c2Feedback"></div>
      <div id="c2Actions" style="display:none">
        <button class="btn-primary btn-sm" onclick="nextC2()">التالي ←</button>
        <button class="btn-outline btn-sm" id="c2ChangeBtn" onclick="changeC2(${idx})" style="display:none">🔄 أريد تغيير قراري</button>
      </div>
    </div>
  `;
}

function decideC2(scIdx, optIdx) {
  const sc = G.c2.scenarios[scIdx];
  const opt = sc.options[optIdx];

  document.querySelectorAll(".c2-opt").forEach((b, i) => {
    b.classList.remove("selected");
    b.disabled = true;
  });
  const btn = $(`c2opt${optIdx}`);
  btn.classList.add("selected");
  if (opt.correct) btn.classList.add("correct");
  else btn.classList.add("wrong");

  // Show correct answer
  sc.options.forEach((o, i) => {
    if (o.correct) $(`c2opt${i}`).classList.add("correct");
  });

  S.c2.decisions[scIdx] = { optIdx, points: opt.points, riskP: opt.correct ? 5 : 2 };
  S.c2.decided = true;

  $("c2Feedback").innerHTML = `
    <div class="feedback-box ${opt.correct ? 'good' : 'bad'}">
      <div class="fb-icon">${opt.correct ? '✅' : '❌'}</div>
      <div class="fb-text">${esc(opt.feedback)}</div>
    </div>
  `;
  $("c2Actions").style.display = "flex";
  $("c2ChangeBtn").style.display = S.c2.decisions.length > 0 ? "inline-flex" : "none";
}

function changeC2(scIdx) {
  renderC2Scenario(scIdx);
}

function nextC2() {
  S.c2.scenario++;
  renderC2Scenario(S.c2.scenario);
}

function finishC2() {
  S.completed.add("c2");
  showFinalResult();
}

// ═══════════════════════════════════════════
// C3: DEAD STREET STORE
// ═══════════════════════════════════════════
function startC3() {
  S.c3 = { step: 0, choices: [] };
  showScreen("c3Screen");
  renderC3Store();
}

function renderC3Store() {
  const st = G.c3.store;
  $("c3Area").innerHTML = `
    <div class="c3-store">
      <div class="c3-store-head">
        <span class="c3-store-icon">🧃</span>
        <div>
          <div class="c3-store-name">${esc(st.name)}</div>
          <div class="c3-store-desc">${esc(st.desc)}</div>
        </div>
      </div>
      <div class="c3-problems">
        ${st.problems.map(p => `<span class="c3-tag">${esc(p)}</span>`).join("")}
      </div>
      <div class="c3-constraints">
        <h4>🚫 القواعد الصارمة</h4>
        ${st.constraints.map(c => `<div class="c3-rule">✕ ${esc(c)}</div>`).join("")}
      </div>
    </div>
    <button class="btn-primary" onclick="startC3Steps()" style="margin-top:20px">ابدأ التحدي ←</button>
  `;
}

function startC3Steps() {
  renderC3Step(0);
}

function renderC3Step(idx) {
  const steps = G.c3.steps;
  if (idx >= steps.length) { finishC3(); return; }
  const step = steps[idx];
  $("c3Area").innerHTML = `
    <div class="c3-step">
      <div class="c3-hint">${esc(G.c3.hint)}</div>
      <h3 class="c3-question">${esc(step.question)}</h3>
      <div class="c3-options">
        ${step.options.map((o, i) => `
          <button class="c3-opt" id="c3opt${i}" onclick="answerC3(${idx},${i})">
            <div class="c3-opt-text">${esc(o.text)}</div>
            <div class="c3-opt-desc">${esc(o.desc)}</div>
          </button>
        `).join("")}
      </div>
      <div id="c3Feedback"></div>
      <div id="c3Actions" style="display:none">
        <button class="btn-primary btn-sm" onclick="nextC3Step()">التالي ←</button>
        <button class="btn-outline btn-sm" id="c3ChangeBtn" onclick="changeC3(${idx})" style="display:none">🔄 أريد تغيير</button>
      </div>
    </div>
  `;
}

function answerC3(stepIdx, optIdx) {
  const step = G.c3.steps[stepIdx];
  const opt = step.options[optIdx];

  document.querySelectorAll(".c3-opt").forEach((b, i) => {
    b.classList.remove("selected");
    b.disabled = true;
  });
  $(`c3opt${optIdx}`).classList.add("selected");
  if (opt.correct) $(`c3opt${optIdx}`).classList.add("correct");
  else $(`c3opt${optIdx}`).classList.add("wrong");

  step.options.forEach((o, i) => {
    if (o.correct) $(`c3opt${i}`).classList.add("correct");
  });

  S.c3.choices[stepIdx] = { optIdx, points: opt.points };

  $("c3Feedback").innerHTML = `
    <div class="feedback-box ${opt.correct ? 'good' : 'bad'}">
      <div class="fb-icon">${opt.correct ? '✅' : '❌'}</div>
      <div class="fb-text">${esc(opt.feedback)}</div>
    </div>
  `;
  $("c3Actions").style.display = "flex";
  if (stepIdx > 0) $("c3ChangeBtn").style.display = "inline-flex";
}

function changeC3(stepIdx) {
  renderC3Step(stepIdx);
}

function nextC3Step() {
  S.c3.step++;
  renderC3Step(S.c3.step);
}

function finishC3() {
  S.completed.add("c3");
  showFinalResult();
}

// ═══════════════════════════════════════════
// C4: CONVINCE ME
// ═══════════════════════════════════════════
function startC4() {
  S.c4 = { persona: 0, choices: [] };
  showScreen("c4Screen");
  $("c4Product").innerHTML = `
    <div class="c4-product">
      <span class="c4-prod-icon">🧤</span>
      <div>
        <div class="c4-prod-name">${esc(G.c4.product)}</div>
      </div>
    </div>
  `;
  renderC4Persona(0);
}

function renderC4Persona(idx) {
  const personas = G.c4.personas;
  if (idx >= personas.length) { finishC4(); return; }
  const p = personas[idx];
  $("c4Area").innerHTML = `
    <div class="c4-persona">
      <div class="c4-p-head">
        <div class="c4-p-avatar">${p.icon}</div>
        <div>
          <div class="c4-p-name">${esc(p.name)}</div>
          <div class="c4-p-role">${esc(p.role)}</div>
        </div>
      </div>
      <div class="c4-p-challenge">"${esc(p.challenge)}"</div>
      <div class="c4-hint">${esc(p.hint)}</div>
      <div class="c4-options">
        ${p.options.map((o, i) => `
          <button class="c4-opt" id="c4opt${i}" onclick="answerC4(${idx},${i})">
            <div class="c4-opt-text">${esc(o.text)}</div>
            <div class="c4-opt-desc">${esc(o.desc)}</div>
          </button>
        `).join("")}
      </div>
      <div id="c4Feedback"></div>
      <div id="c4Actions" style="display:none">
        <button class="btn-primary btn-sm" onclick="nextC4()">التالي ←</button>
        <button class="btn-outline btn-sm" id="c4ChangeBtn" onclick="changeC4(${idx})" style="display:none">🔄 أريد تغيير</button>
      </div>
    </div>
  `;
  renderC4Nav(idx);
}

function answerC4(personaIdx, optIdx) {
  const p = G.c4.personas[personaIdx];
  const opt = p.options[optIdx];

  document.querySelectorAll(".c4-opt").forEach((b, i) => {
    b.classList.remove("selected");
    b.disabled = true;
  });
  $(`c4opt${optIdx}`).classList.add("selected");
  if (opt.correct) $(`c4opt${optIdx}`).classList.add("correct");
  else $(`c4opt${optIdx}`).classList.add("wrong");

  p.options.forEach((o, i) => {
    if (o.correct) $(`c4opt${i}`).classList.add("correct");
  });

  S.c4.choices[personaIdx] = { optIdx, points: opt.points };

  $("c4Feedback").innerHTML = `
    <div class="feedback-box ${opt.correct ? 'good' : 'bad'}">
      <div class="fb-icon">${opt.correct ? '✅' : '❌'}</div>
      <div class="fb-text">${esc(opt.feedback)}</div>
    </div>
  `;
  $("c4Actions").style.display = "flex";
  if (personaIdx > 0) $("c4ChangeBtn").style.display = "inline-flex";
}

function changeC4(personaIdx) {
  renderC4Persona(personaIdx);
}

function nextC4() {
  S.c4.persona++;
  renderC4Persona(S.c4.persona);
}

function renderC4Nav(current) {
  $("c4Nav").innerHTML = G.c4.personas.map((_, i) => {
    let cls = "nav-dot";
    if (i === current) cls += " active";
    else if (i < current) cls += " done";
    return `<div class="${cls}"></div>`;
  }).join("");
}

function finishC4() {
  S.completed.add("c4");
  showFinalResult();
}

// ═══════════════════════════════════════════
// FINAL RESULT
// ═══════════════════════════════════════════
function showFinalResult() {
  renderJourney("type");
  showScreen("resultScreen");
  renderFinalResult();
}

// Compute the final result strictly from the player's stored answers.
// Every answered question is worth up to 5 points; score = earned/possible.
function computeResult() {
  const axes = { creativity: 0, problemSolving: 0, decision: 0, risk: 0, strategy: 0, userFocus: 0 };
  const pb = { creativity: 0, problemSolving: 0, decision: 0, risk: 0, strategy: 0, userFocus: 0 };
  let earned = 0, possible = 0;

  function add(points, key) {
    earned += points;
    possible += 5;
    axes[key] += points;
    pb[key] += 5;
  }

  (S.c1.answers || []).forEach(an => add(an.points, "creativity"));

  (S.c2.decisions || []).forEach(d => {
    add(d.points, "decision");
    add(d.riskP != null ? d.riskP : (d.points === 5 ? 5 : 2), "risk");
    add(d.points, "strategy");
  });

  (S.c3.choices || []).forEach(c => {
    add(c.points, "problemSolving");
    add(c.points, "creativity");
  });

  (S.c4.choices || []).forEach(c => add(c.points, "userFocus"));

  const pct = possible ? Math.round((earned / possible) * 100) : 0;

  // Personality matching from real performance: relative strength per skill axis.
  const P = k => pb[k] ? axes[k] / pb[k] : 0;
  const comp = {
    bold: P("risk"),
    user: P("userFocus"),
    creative: P("creativity") * 0.6 + P("problemSolving") * 0.4,
    strategic: P("strategy"),
    fast: P("decision")
  };

  const rank = ["user", "creative", "strategic", "bold", "fast"];
  const pKeys = ["innovator_user", "innovator_creative", "innovator_strategic", "innovator_bold", "innovator_fast"];
  let personaKey = "innovator_fast";
  if (possible) {
    let best = -1;
    rank.forEach((r, i) => {
      if (comp[r] > best) { best = comp[r]; personaKey = pKeys[i]; }
    });
  }

  return { pct, axes, pb, earned, possible, personaKey, comp };
}

function renderFinalResult() {
  const R = computeResult();
  const pct = Math.min(R.pct, 100);
  const p = G.personalities[R.personaKey];

  $("resultContent").innerHTML = `
    <div class="r-personality" style="--pc:${p.color}">
      <div class="r-badge">${esc(p.icon)} <span>من أنت كمبتكر؟</span></div>
      <div class="r-icon">${esc(p.icon)}</div>
      <h1 class="r-type">${esc(p.type)}</h1>
      <p class="r-desc">${esc(p.desc)}</p>
    </div>

    <div class="r-match">
      <div class="r-match-title">مبتكر يشبهك</div>
      <div class="r-match-card">
        <img class="r-match-img" src="${esc(p.matchImg)}" alt="${esc(p.match)}" onerror="this.style.display='none'">
        <div>
          <div class="r-match-name">أنت تشبه: <strong>${esc(p.match)}</strong></div>
          <div class="r-match-reason">${esc(p.matchReason)}</div>
        </div>
      </div>
    </div>

    <div class="r-advice">
      <div class="r-advice-title">💡 نصيحتك كمبتكر</div>
      <div class="r-advice-text">${esc(p.advice)}</div>
    </div>

    <div class="r-scores">
      <div class="r-scores-title">أداؤك كمبتكر</div>
      ${renderScoreBar("الإبداع", R.pb.creativity ? Math.round(R.axes.creativity / R.pb.creativity * 100) : 0)}
      ${renderScoreBar("حل المشكلات", R.pb.problemSolving ? Math.round(R.axes.problemSolving / R.pb.problemSolving * 100) : 0)}
      ${renderScoreBar("اتخاذ القرار", R.pb.decision ? Math.round(R.axes.decision / R.pb.decision * 100) : 0)}
      ${renderScoreBar("التفكير الاستراتيجي", R.pb.strategy ? Math.round(R.axes.strategy / R.pb.strategy * 100) : 0)}
      ${renderScoreBar("فهم الجمهور", R.pb.userFocus ? Math.round(R.axes.userFocus / R.pb.userFocus * 100) : 0)}
      ${renderScoreBar("تقبل المخاطر", R.pb.risk ? Math.round(R.axes.risk / R.pb.risk * 100) : 0)}
      <div class="r-total">
        <span class="t-label"> نتيجتك النهائية</span>
        <span class="r-total-num"><span id="scoreCounter">0</span><small> / 100</small></span>
      </div>
    </div>

    <div class="r-name-section">
      <div class="r-name-label">✍️ اكتب اسمك لإنشاء بطاقتك</div>
      <input class="r-name-input" id="playerNameInput" placeholder="اسمك هنا..." maxlength="30">
      <button class="btn-primary" onclick="generateCard()">إنشاء البطاقة <span class="btn-arrow">←</span></button>
    </div>
  `;
  animateCounter("scoreCounter", pct);
}

function animateCounter(id, target, dur = 1600) {
  const el = document.getElementById(id);
  if (!el) return;
  const start = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * eased);
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function renderScoreBar(label, pctScore) {
  const pctc = Math.max(0, Math.min(100, Math.round(pctScore)));
  const stars = pctc >= 80 ? "⭐⭐⭐⭐⭐" : pctc >= 60 ? "⭐⭐⭐⭐☆" : pctc >= 40 ? "⭐⭐⭐☆☆" : pctc >= 20 ? "⭐⭐☆☆☆" : "⭐☆☆☆☆";
  return `
    <div class="score-row">
      <div class="score-label">${esc(label)}</div>
      <div class="score-stars">${stars}</div>
    </div>
  `;
}

// ═══ SHAREABLE CARD ═══
function generateCard() {
  const name = $("playerNameInput").value.trim();
  if (!name) { alert("الرجاء كتابة اسمك"); return; }
  S.playerName = name;

  const R = computeResult();
  const pct = Math.min(R.pct, 100);
  const p = G.personalities[R.personaKey];

  $("cardName").textContent = name;
  $("cardType").textContent = p.type;
  $("cardIcon").textContent = p.icon;
  $("cardScore").innerHTML = pct + "<small>/100</small>";
  $("cardMatch").textContent = "يشبه: " + p.match;
  $("cardDesc").textContent = p.desc;
  $("cardOverlay").classList.add("show");
}

function closeCard() {
  $("cardOverlay").classList.remove("show");
}

// ═══ FX ENGINE — particles, tilt, magnetic, parallax ═══
const FX = {
  init() {
    this.particles();
    this.tilt();
    this.magnetic();
    this.parallax();
    window.addEventListener("mousemove", e => (FX.mx = e.clientX, FX.my = e.clientY));
  },
  particles() {
    const cv = document.getElementById("particles");
    if (!cv) return;
    const ctx = cv.getContext("2d");
    let W, H, pts = [], raf;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      W = cv.width = window.innerWidth * DPR;
      H = cv.height = window.innerHeight * DPR;
      const n = Math.min(90, Math.floor((W / DPR) / 18));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .35 * DPR, vy: (Math.random() - .5) * .35 * DPR,
        r: (Math.random() * 1.6 + .4) * DPR,
        a: Math.random() * .5 + .15
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,201,77,${p.a})`;
        ctx.fill();
      }
      if (FX.mx !== undefined) {
        const mx = FX.mx * DPR, my = FX.my * DPR;
        for (const p of pts) {
          const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
          if (d < 130 * DPR) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mx, my);
            ctx.strokeStyle = `rgba(255,201,77,${(1 - d / (130 * DPR)) * .28})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    resize();
    draw();
    window.addEventListener("resize", resize);
  },
  tilt() {
    const cards = document.querySelectorAll("[data-tilt]");
    if (!cards.length || !window.matchMedia("(hover:hover)").matches) return;
    cards.forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientX - r.left) / r.width - .5) * 12;
        const ry = ((e.clientY - r.top) / r.height - .5) * -12;
        card.style.transform = `perspective(700px) rotateY(${rx}deg) rotateX(${ry}deg) translateY(-6px)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = ""; });
    });
  },
  magnetic() {
    const els = document.querySelectorAll("[data-magnetic]");
    if (!els.length || !window.matchMedia("(hover:hover)").matches) return;
    els.forEach(el => {
      el.addEventListener("mousemove", e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * .25;
        const y = (e.clientY - r.top - r.height / 2) * .25;
        el.style.translate = `${x}px ${y}px`;
      });
      el.addEventListener("mouseleave", () => { el.style.translate = ""; });
    });
  },
  parallax() {
    const orbs = document.querySelectorAll(".orb");
    if (!orbs.length) return;
    window.addEventListener("pointermove", e => {
      orbs.forEach((o, i) => {
        const depth = (i + 1) * 14;
        o.style.translate = `${(e.clientX - window.innerWidth / 2) / depth}px ${(e.clientY - window.innerHeight / 2) / depth}px`;
      });
    });
  }
};

// ═══ INIT ═══
function init() {
  FX.init();
  initLanding();
  initAbout();
  initMenu();
}

init();
