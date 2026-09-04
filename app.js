"use strict";

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// ═══ STATE ═══
const S = {
  screen: "landing",
  completed: new Set(),
  scores: { creativity: 0, problemSolving: 0, decision: 0, risk: 0, strategy: 0, userFocus: 0, speed: 0 },
  totalPossible: 0,
  // C1
  c1: { problem: null, audience: null, challengeStep: 0, challengeIdx: 0 },
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ═══ LANDING ═══
function initLanding() {
  $("landingTitle").textContent = G.landing.title;
  $("landingSub").textContent = G.landing.subtitle;
  $("entrepreneursGrid").innerHTML = G.landing.entrepreneurs.map(e => {
    const fallback = e.name[0];
    return `<div class="e-card">
      <div class="e-img-wrap">
        <img class="e-img" src="${esc(e.img)}" alt="${esc(e.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">
        <div class="e-fallback" style="display:none">${fallback}</div>
      </div>
      <div class="e-name">${esc(e.name)}</div>
      <div class="e-company">${esc(e.company)}</div>
    </div>`;
  }).join("");
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
  $("qrImg").src = a.qrCode;
}

// ═══ MENU ═══
function initMenu() {
  const done = S.completed.size;
  $("menuProgress").style.width = (done / 4 * 100) + "%";
  $("challengesGrid").innerHTML = G.challenges.map(c => `
    <div class="ch-card" style="--c:${c.color}" onclick="startChallenge('${c.id}')">
      <div class="ch-num">${c.number}</div>
      <div class="ch-icon">${c.icon}</div>
      <h3>${esc(c.title)}</h3>
      <p>${esc(c.desc)}</p>
      <div class="ch-meta">
        <span class="diff-badge ${c.diff === 'متوسط' ? 'easy' : c.diff === 'صعب' ? 'med' : 'hard'}">${esc(c.diff)}</span>
        <span>⏱️ ${esc(c.time)}</span>
        ${S.completed.has(c.id) ? '<span class="done-badge">✓ مكتمل</span>' : ''}
      </div>
    </div>
  `).join("");
}

// ═══ START CHALLENGE ═══
function startChallenge(id) {
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
  S.c1 = { problem: null, audience: null, step: 0, challengeIdx: 0 };
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
  if (type === "problem") S.c1.problem = G.c1.problems.find(p => p.id === id);
  else S.c1.audience = G.c1.audiences.find(a => a.id === id);

  if (S.c1.problem && S.c1.audience) {
    $("c1Step1").style.display = "none";
    $("c1Step2").style.display = "block";
    $("c1Preview").innerHTML = `
      <div class="preview-item">
        <span class="preview-icon">${S.c1.problem.icon}</span>
        <span class="preview-text">${esc(S.c1.problem.title)}</span>
      </div>
      <span class="preview-plus">×</span>
      <div class="preview-item">
        <span class="preview-icon">${S.c1.audience.icon}</span>
        <span class="preview-text">${esc(S.c1.audience.title)}</span>
      </div>
    `;
  }
}

function startC1Challenge() {
  $("c1Step2").style.display = "none";
  $("c1Step3").style.display = "block";
  renderC1Challenge(0);
}

function renderC1Challenge(idx) {
  const ch = G.c1.challenges.find(c =>
    c.problemId === S.c1.problem.id && c.audienceId === S.c1.audience.id
  );
  if (!ch) {
    // Fallback: pick a random challenge
    const fallback = G.c1.challenges[idx % G.c1.challenges.length];
    renderC1Question(fallback);
    return;
  }
  renderC1Question(ch);
}

function renderC1Question(ch) {
  S.c1.challengeData = ch;
  $("c1QuestionArea").innerHTML = `
    <div class="c1-q-card">
      <div class="c1-hint">${esc(ch.hint)}</div>
      <h3 class="c1-question">${esc(ch.question)}</h3>
      <div class="c1-options">
        ${ch.options.map((o, i) => `
          <button class="c1-opt" onclick="answerC1(${i})">
            <div class="c1-opt-title">${esc(o.text)}</div>
            <div class="c1-opt-desc">${esc(o.desc)}</div>
          </button>
        `).join("")}
      </div>
      <div id="c1Feedback"></div>
      <div id="c1Actions" style="display:none">
        <button class="btn-primary btn-sm" onclick="finishC1()">النتيجة النهائية →</button>
      </div>
    </div>
  `;
}

function answerC1(idx) {
  const ch = S.c1.challengeData;
  const opt = ch.options[idx];
  document.querySelectorAll(".c1-opt").forEach((b, i) => {
    b.classList.remove("selected");
    b.disabled = true;
    if (i === ch.correctIndex) b.classList.add("correct");
    if (i === idx && idx !== ch.correctIndex) b.classList.add("wrong");
  });
  S.scores.creativity += opt.points;
  S.totalPossible += 5;
  const fb = $("c1Feedback");
  fb.innerHTML = `
    <div class="feedback-box ${opt.best ? 'good' : 'bad'}">
      <div class="fb-icon">${opt.best ? '✅' : '❌'}</div>
      <div class="fb-text">${esc(opt.feedback)}</div>
      <div class="fb-risk">${esc(opt.risk)}</div>
    </div>
  `;
  $("c1Actions").style.display = "block";
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
  S.scores.decision = 0; S.scores.risk = 0; S.scores.strategy = 0;
  S.totalPossible = 0;
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

  S.scores.decision += opt.points;
  S.scores.risk += opt.correct ? 5 : 2;
  S.scores.strategy += opt.points;
  S.totalPossible += 5;

  S.c2.decisions[scIdx] = { optIdx, points: opt.points };
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
  const sc = G.c2.scenarios[scIdx];
  const prev = S.c2.decisions[scIdx];
  S.scores.decision -= prev.points;

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
  S.scores.problemSolving = 0; S.scores.creativity = 0;
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

  S.scores.problemSolving += opt.points;
  S.scores.creativity += opt.points;
  S.totalPossible += 5;

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
  const prev = S.c3.choices[stepIdx];
  S.scores.problemSolving -= prev.points;
  S.scores.creativity -= prev.points;
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
  S.scores.userFocus = 0;
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

  S.scores.userFocus += opt.points;
  S.totalPossible += 5;
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
  const prev = S.c4.choices[personaIdx];
  S.scores.userFocus -= prev.points;
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
  showScreen("resultScreen");
  renderFinalResult();
}

function renderFinalResult() {
  // Calculate personality
  const maxScore = S.totalPossible || 1;
  const total = S.scores.creativity + S.scores.problemSolving + S.scores.decision + S.scores.risk + S.scores.strategy + S.scores.userFocus + S.scores.speed;
  const pct = Math.round((total / (maxScore * 7)) * 100);

  let personaKey = "innovator_fast";
  const scores = S.scores;
  if (scores.userFocus >= scores.decision && scores.userFocus >= scores.creativity) personaKey = "innovator_user";
  else if (scores.strategy >= scores.risk && scores.strategy >= scores.speed) personaKey = "innovator_strategic";
  else if (scores.creativity >= scores.decision && scores.creativity >= scores.risk) personaKey = "innovator_creative";
  else if (scores.risk >= scores.strategy && scores.risk >= scores.userFocus) personaKey = "innovator_bold";

  const p = G.personalities[personaKey];

  // Name input area
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
      ${renderScoreBar("الإبداع", scores.creativity, 15)}
      ${renderScoreBar("حل المشكلات", scores.problemSolving, 15)}
      ${renderScoreBar("اتخاذ القرار", scores.decision, 15)}
      ${renderScoreBar("التفكير الاستراتيجي", scores.strategy, 15)}
      ${renderScoreBar("فهم الجمهور", scores.userFocus, 15)}
      ${renderScoreBar("تقبل المخاطر", scores.risk, 15)}
      <div class="r-total">
        <span> نتيجتك النهائية</span>
        <span class="r-total-num">${Math.min(pct, 100)} / 100</span>
      </div>
    </div>

    <div class="r-name-section">
      <div class="r-name-label">✍️ اكتب اسمك لإنشاء بطاقتك</div>
      <input class="r-name-input" id="playerNameInput" placeholder="اسمك هنا..." maxlength="30">
      <button class="btn-primary" onclick="generateCard()">إنشاء البطاقة ←</button>
    </div>
  `;
}

function renderScoreBar(label, value, max) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const stars = pct >= 80 ? "⭐⭐⭐⭐⭐" : pct >= 60 ? "⭐⭐⭐⭐☆" : pct >= 40 ? "⭐⭐⭐☆☆" : pct >= 20 ? "⭐⭐☆☆☆" : "⭐☆☆☆☆";
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

  const maxScore = S.totalPossible || 1;
  const total = S.scores.creativity + S.scores.problemSolving + S.scores.decision + S.scores.risk + S.scores.strategy + S.scores.userFocus + S.scores.speed;
  const pct = Math.round((total / (maxScore * 7)) * 100);

  let personaKey = "innovator_fast";
  const scores = S.scores;
  if (scores.userFocus >= scores.decision && scores.userFocus >= scores.creativity) personaKey = "innovator_user";
  else if (scores.strategy >= scores.risk && scores.strategy >= scores.speed) personaKey = "innovator_strategic";
  else if (scores.creativity >= scores.decision && scores.creativity >= scores.risk) personaKey = "innovator_creative";
  else if (scores.risk >= scores.strategy && scores.risk >= scores.userFocus) personaKey = "innovator_bold";

  const p = G.personalities[personaKey];

  $("cardName").textContent = name;
  $("cardType").textContent = p.type;
  $("cardIcon").textContent = p.icon;
  $("cardScore").textContent = Math.min(pct, 100) + "/100";
  $("cardMatch").textContent = "يشبه: " + p.match;
  $("cardDesc").textContent = p.desc;
  $("cardOverlay").style.display = "flex";
}

function closeCard() {
  $("cardOverlay").style.display = "none";
}

// ═══ INIT ═══
function init() {
  initLanding();
  initAbout();
  initMenu();
}

init();
