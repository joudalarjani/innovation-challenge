"use strict";

// ============================================================
// Innovation Challenge — Game Engine
// نادي الابتكار - محرك اللعبة التفاعلية
// ============================================================

// ===== STATE =====
const state = {
  currentScreen: "landingScreen",
  completedChallenges: new Set(),
  
  // Challenge 1
  c1: { selectedProblem: null, selectedAudience: null, timer: null, timeLeft: 900 },
  
  // Challenge 2
  c2: { currentDecision: 0, decisions: [], timer: null, timeLeft: 60 },
  
  // Challenge 3
  c3: { selectedPivots: [], timer: null, timeLeft: 600 },
  
  // Challenge 4
  c4: { currentPersona: 0, responses: [], timer: null, timeLeft: 120 }
};

// ===== UTILITY =====
const $ = (id) => document.getElementById(id);
const esc = (str) => String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function clearAllTimers() {
  [state.c1.timer, state.c2.timer, state.c3.timer, state.c4.timer].forEach(t => {
    if (t) clearInterval(t);
  });
}

// ===== SCREEN NAVIGATION =====
function showScreen(screenId) {
  clearAllTimers();
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  $(screenId).classList.add("active");
  state.currentScreen = screenId;
  window.scrollTo(0, 0);
}

// ===== LANDING PAGE =====
function renderLanding() {
  $("landingTitle").textContent = GAME_DATA.landing.title;
  $("landingSubtitle").textContent = GAME_DATA.landing.subtitle;

  const grid = $("entrepreneursGrid");
  grid.innerHTML = GAME_DATA.landing.entrepreneurs.map(e => `
    <div class="entrepreneur-card">
      <img class="entrepreneur-img" src="${esc(e.image)}" alt="${esc(e.name)}" 
           onerror="this.style.display='none'">
      <span class="entrepreneur-name">${esc(e.name)}</span>
      <span class="entrepreneur-company">${esc(e.company)}</span>
    </div>
  `).join("");
}

// ===== ABOUT PAGE =====
function renderAbout() {
  $("aboutTitle").textContent = GAME_DATA.about.title;
  $("aboutSubtitle").textContent = GAME_DATA.about.subtitle;
  $("aboutDesc").textContent = GAME_DATA.about.description;
  $("qrImage").src = GAME_DATA.about.qrCode;

  $("achievementsGrid").innerHTML = GAME_DATA.about.achievements.map(a => `
    <div class="achievement-card">
      <div class="achievement-icon">${a.icon}</div>
      <div class="achievement-value">${a.value}</div>
      <div class="achievement-label">${esc(a.label)}</div>
    </div>
  `).join("");
}

// ===== MENU =====
function renderMenu() {
  const completed = state.completedChallenges.size;
  const total = GAME_DATA.challenges.length;
  $("menuProgress").style.width = (completed / total * 100) + "%";

  $("challengesGrid").innerHTML = GAME_DATA.challenges.map(c => {
    const diffClass = c.difficulty === "متوسط" ? "easy" : 
                      c.difficulty === "صعب" ? "medium" : 
                      c.difficulty === "صعب جدًا" ? "hard" : "extreme";
    const isCompleted = state.completedChallenges.has(c.id);
    
    return `
      <div class="challenge-card" style="--c: ${c.color}" onclick="startChallenge('${c.id}')">
        <div class="challenge-number">${c.number}</div>
        <div class="challenge-icon">${c.icon}</div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.description)}</p>
        <div class="challenge-meta">
          <span class="difficulty-badge ${diffClass}">${esc(c.difficulty)}</span>
          <span>⏱️ ${esc(c.time)}</span>
          ${isCompleted ? '<span style="color: var(--green);">✓ مكتمل</span>' : ''}
        </div>
      </div>
    `;
  }).join("");
}

// ===== CHALLENGE STARTER =====
function startChallenge(id) {
  clearAllTimers();
  switch(id) {
    case "challenge1": startChallenge1(); break;
    case "challenge2": startChallenge2(); break;
    case "challenge3": startChallenge3(); break;
    case "challenge4": startChallenge4(); break;
  }
}

// ============================================
// CHALLENGE 1: PROBLEM + AUDIENCE
// ============================================
function startChallenge1() {
  state.c1 = { selectedProblem: null, selectedAudience: null, timer: null, timeLeft: 900 };
  showScreen("challenge1Screen");

  $("c1Title").textContent = GAME_DATA.challenge1.title;
  $("c1Instruction").textContent = GAME_DATA.challenge1.instruction;

  // Shuffle and render problems
  const problems = shuffleArray(GAME_DATA.challenge1.problems);
  $("c1ProblemsGrid").innerHTML = problems.map(p => `
    <div class="card-item" data-type="problem" data-id="${p.id}" onclick="selectCard(this, 'problem', ${p.id})">
      <div class="card-number">${p.id}</div>
      <div class="card-icon">${p.icon}</div>
      <div class="card-title">${esc(p.title)}</div>
      <div class="card-desc">${esc(p.description)}</div>
    </div>
  `).join("");

  // Shuffle and render audiences
  const audiences = shuffleArray(GAME_DATA.challenge1.audiences);
  $("c1AudiencesGrid").innerHTML = audiences.map(a => `
    <div class="card-item" data-type="audience" data-id="${a.id}" onclick="selectCard(this, 'audience', ${a.id})">
      <div class="card-number">${a.id}</div>
      <div class="card-icon">${a.icon}</div>
      <div class="card-title">${esc(a.title)}</div>
      <div class="card-desc">${esc(a.description)}</div>
    </div>
  `).join("");

  $("c1SelectedPreview").style.display = "none";
  $("c1InnovationSection").style.display = "none";
  startTimer(state.c1, "c1Timer", "c1TimerBar");
}

function selectCard(el, type, id) {
  // Remove previous selection of same type
  document.querySelectorAll(`.card-item[data-type="${type}"]`).forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");

  if (type === "problem") {
    state.c1.selectedProblem = GAME_DATA.challenge1.problems.find(p => p.id === id);
  } else {
    state.c1.selectedAudience = GAME_DATA.challenge1.audiences.find(a => a.id === id);
  }

  updateC1Preview();
}

function updateC1Preview() {
  const { selectedProblem, selectedAudience } = state.c1;
  if (selectedProblem && selectedAudience) {
    $("c1SelectedPreview").style.display = "flex";
    $("c1SelectedProblem").innerHTML = `
      <div class="card-icon">${selectedProblem.icon}</div>
      <div class="card-title">${esc(selectedProblem.title)}</div>
      <div class="card-desc">${esc(selectedProblem.description)}</div>
    `;
    $("c1SelectedAudience").innerHTML = `
      <div class="card-icon">${selectedAudience.icon}</div>
      <div class="card-title">${esc(selectedAudience.title)}</div>
      <div class="card-desc">${esc(selectedAudience.description)}</div>
    `;
    $("c1InnovationSection").style.display = "block";
  }
}

function submitChallenge1() {
  const solution = $("c1InnovationInput").value.trim();
  if (!solution) {
    alert("الرجاء كتابة حلّك الابتكاري");
    return;
  }
  
  state.completedChallenges.add("challenge1");
  clearAllTimers();
  
  showResult("challenge1", {
    problem: state.c1.selectedProblem,
    audience: state.c1.selectedAudience,
    solution: solution,
    timeUsed: 900 - state.c1.timeLeft
  });
}

// ============================================
// CHALLENGE 2: 60-SECOND DECISIONS
// ============================================
function startChallenge2() {
  state.c2 = { currentDecision: 0, decisions: [], timer: null, timeLeft: 60 };
  showScreen("challenge2Screen");

  $("c2Instruction").textContent = GAME_DATA.challenge2.instruction;
  $("c2NextBtn").style.display = "none";

  renderDecision(0);
  startTimer(state.c2, "c2Timer", "c2TimerBar", 60);
}

function renderDecision(index) {
  const scenarios = GAME_DATA.challenge2.scenarios;
  if (index >= scenarios.length) {
    finishChallenge2();
    return;
  }

  const s = scenarios[index];
  $("c2DecisionArea").innerHTML = `
    <div class="decision-card">
      <div class="decision-number">
        <span>⚡</span>
        الموقف ${index + 1} من ${scenarios.length}
      </div>
      <h3 class="decision-title">${esc(s.title)}</h3>
      <p class="decision-situation">${esc(s.situation)}</p>
      <div class="decision-options">
        ${s.options.map((opt, i) => `
          <button class="decision-option" onclick="selectDecision(${index}, ${i})" data-index="${i}">
            ${esc(opt.text)}
          </button>
        `).join("")}
      </div>
      <div class="follow-up" id="c2FollowUp" style="display: none;"></div>
    </div>
  `;

  state.c2.timeLeft = 60;
  $("c2Timer").textContent = formatTime(60);
  $("c2TimerBar").style.width = "100%";
  $("c2TimerBar").className = "timer-bar";
  $("c2NextBtn").style.display = "none";
}

function selectDecision(decisionIndex, optionIndex) {
  const s = GAME_DATA.challenge2.scenarios[decisionIndex];
  const option = s.options[optionIndex];

  // Visual feedback
  document.querySelectorAll(".decision-option").forEach((btn, i) => {
    btn.classList.toggle("selected", i === optionIndex);
    btn.style.pointerEvents = "none";
  });

  // Record decision
  state.c2.decisions.push({
    scenarioId: s.id,
    optionIndex: optionIndex,
    trait: option.trait,
    points: option.points,
    timeUsed: 60 - state.c2.timeLeft
  });

  // Show follow-up
  const followUp = $("c2FollowUp");
  followUp.textContent = "📢 " + s.followUp;
  followUp.style.display = "block";

  // Stop timer and show next button
  clearInterval(state.c2.timer);
  $("c2NextBtn").style.display = "inline-flex";
  $("c2NextBtn").textContent = state.c2.currentDecision < GAME_DATA.challenge2.scenarios.length - 1 
    ? "التالي ←" : "عرض النتيجة ←";
  
  state.c2.currentDecision++;
}

function nextDecision() {
  renderDecision(state.c2.currentDecision);
  startTimer(state.c2, "c2Timer", "c2TimerBar", 60);
}

function finishChallenge2() {
  clearAllTimers();
  state.completedChallenges.add("challenge2");

  // Calculate personality
  const traitCounts = {};
  let totalPoints = 0;
  state.c2.decisions.forEach(d => {
    traitCounts[d.trait] = (traitCounts[d.trait] || 0) + 1;
    totalPoints += d.points;
  });

  const dominantTrait = Object.entries(traitCounts)
    .sort((a, b) => b[1] - a[1])[0][0];

  const personality = GAME_DATA.challenge2.personalityResults[dominantTrait];

  showResult("challenge2", {
    personality: personality,
    decisions: state.c2.decisions,
    totalPoints: totalPoints,
    maxPoints: GAME_DATA.challenge2.scenarios.length * 4
  });
}

// ============================================
// CHALLENGE 3: DEAD STREET STORE
// ============================================
function startChallenge3() {
  state.c3 = { selectedPivots: [], timer: null, timeLeft: 600 };
  showScreen("challenge3Screen");

  $("c3Instruction").textContent = GAME_DATA.challenge3.instruction;

  const store = GAME_DATA.challenge3.store;
  $("c3StoreArea").innerHTML = `
    <div class="pivot-store">
      <div class="store-header">
        <div class="store-icon">🧃</div>
        <div>
          <div class="store-name">${esc(store.name)}</div>
          <div class="store-desc">${esc(store.description)}</div>
        </div>
      </div>

      <div class="problems-list">
        ${store.problems.map(p => `
          <span class="problem-tag">${p.icon} ${esc(p.title)} (${esc(p.severity)})</span>
        `).join("")}
      </div>

      <div class="constraints-box">
        <h4>🚫 القواعد الصارمة</h4>
        <ul class="constraints-list">
          ${store.constraints.map(c => `<li>${esc(c)}</li>`).join("")}
        </ul>
      </div>

      <h3 style="margin-bottom: 16px;">🔄 اختر نهج الـ Pivot</h3>
      <div class="pivot-options">
        ${store.pivots.map(p => `
          <div class="pivot-card" onclick="selectPivot(this, ${p.id})" data-id="${p.id}">
            <h4>${esc(p.title)}</h4>
            <p>${esc(p.description)}</p>
            <div class="pivot-examples">
              ${p.examples.map(e => `<span class="pivot-example">${esc(e)}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  $("c3PivotSection").style.display = "block";
  startTimer(state.c3, "c3Timer", "c3TimerBar", 600);
}

function selectPivot(el, id) {
  el.classList.toggle("selected");
  
  if (el.classList.contains("selected")) {
    state.c3.selectedPivots.push(id);
  } else {
    state.c3.selectedPivots = state.c3.selectedPivots.filter(p => p !== id);
  }
}

function submitChallenge3() {
  const plan = $("c3PivotInput").value.trim();
  if (!plan) {
    alert("الرجاء كتابة خطتك لإنقاذ المتجر");
    return;
  }

  state.completedChallenges.add("challenge3");
  clearAllTimers();

  showResult("challenge3", {
    selectedPivots: state.c3.selectedPivots,
    plan: plan,
    timeUsed: 600 - state.c3.timeLeft
  });
}

// ============================================
// CHALLENGE 4: CONVINCE ME
// ============================================
function startChallenge4() {
  state.c4 = { currentPersona: 0, responses: [], timer: null, timeLeft: 120 };
  showScreen("challenge4Screen");

  $("c4Instruction").textContent = GAME_DATA.challenge4.instruction;

  // Show product
  const product = GAME_DATA.challenge4.product;
  $("c4ProductDisplay").innerHTML = `
    <div class="store-header">
      <div class="store-icon">🧤</div>
      <div>
        <div class="store-name">${esc(product.name)}</div>
        <div class="store-desc">${esc(product.description)}</div>
      </div>
    </div>
  `;

  renderPersona(0);
  renderPersonaNav();
  startTimer(state.c4, "c4Timer", "c4TimerBar", 120);
}

function renderPersona(index) {
  const personas = GAME_DATA.challenge4.personas;
  if (index >= personas.length) {
    $("c4PersonaArea").innerHTML = '<p style="text-align:center;color:var(--accent);font-size:1.1rem;">✅ لقد أكملت جميع الشخصيات!</p>';
    $("c4SubmitBtn").style.display = "inline-flex";
    clearInterval(state.c4.timer);
    return;
  }

  const p = personas[index];
  $("c4PersonaArea").innerHTML = `
    <div class="persona-card">
      <div class="persona-header">
        <div class="persona-avatar">${p.icon}</div>
        <div class="persona-info">
          <h3>${esc(p.name)}</h3>
          <span class="persona-role">${esc(p.role)}</span>
        </div>
      </div>
      <div class="persona-personality">
        <strong>الشخصية:</strong> ${esc(p.personality)}
      </div>
      <div class="persona-challenge">
        "${esc(p.challenge)}"
      </div>
      <div class="persona-hints">
        <h4>💡 اقتراحات:</h4>
        <div class="hint-tags">
          ${p.hints.map(h => `<span class="hint-tag">${esc(h)}</span>`).join("")}
        </div>
      </div>
      <textarea class="persona-input" id="c4Response" 
                placeholder="اكتب كيف ستقنع ${esc(p.name)} بالمنتج..."></textarea>
    </div>
  `;

  renderPersonaNav();
}

function renderPersonaNav() {
  const personas = GAME_DATA.challenge4.personas;
  $("c4PersonaNav").innerHTML = personas.map((p, i) => {
    let cls = "persona-dot";
    if (i === state.c4.currentPersona) cls += " active";
    else if (i < state.c4.currentPersona) cls += " done";
    return `<div class="${cls}" onclick="goToPersona(${i})"></div>`;
  }).join("");
}

function goToPersona(index) {
  // Save current response
  saveCurrentResponse();
  
  state.c4.currentPersona = index;
  renderPersona(index);
  
  if (index < state.c4.responses.length) {
    $("c4Response").value = state.c4.responses[index] || "";
  }
}

function saveCurrentResponse() {
  const input = $("c4Response");
  if (input) {
    state.c4.responses[state.c4.currentPersona] = input.value;
  }
}

function submitChallenge4() {
  saveCurrentResponse();
  
  // Check all responses
  const emptyCount = state.c4.responses.filter(r => !r || r.trim() === "").length;
  if (emptyCount > 0) {
    if (!confirm(`لديك ${emptyCount} شخصية لم تُجب عنها. هل تريد الإرسال؟`)) {
      return;
    }
  }

  state.completedChallenges.add("challenge4");
  clearAllTimers();

  showResult("challenge4", {
    responses: state.c4.responses,
    personas: GAME_DATA.challenge4.personas
  });
}

// ============================================
// TIMER SYSTEM
// ============================================
function startTimer(timerState, displayId, barId, duration) {
  if (timerState.timer) clearInterval(timerState.timer);
  
  const totalDuration = duration || timerState.timeLeft;
  
  timerState.timer = setInterval(() => {
    timerState.timeLeft--;
    
    $(displayId).textContent = formatTime(timerState.timeLeft);
    
    const pct = (timerState.timeLeft / totalDuration) * 100;
    $(barId).style.width = pct + "%";
    
    // Color changes
    if (pct <= 20) {
      $(barId).className = "timer-bar danger";
      $(displayId).classList.add("urgent");
      $(displayId).classList.remove("warning");
    } else if (pct <= 50) {
      $(barId).className = "timer-bar warning";
      $(displayId).classList.add("warning");
      $(displayId).classList.remove("urgent");
    } else {
      $(barId).className = "timer-bar";
      $(displayId).classList.remove("urgent", "warning");
    }
    
    if (timerState.timeLeft <= 0) {
      clearInterval(timerState.timer);
      // Auto-submit or next
      if (displayId === "c2Timer") {
        // Auto-select first option if no selection
        const currentScenario = GAME_DATA.challenge2.scenarios[state.c2.currentDecision];
        if (currentScenario && !state.c2.decisions.find(d => d.scenarioId === currentScenario.id)) {
          selectDecision(state.c2.currentDecision, 0);
        }
      }
    }
  }, 1000);
}

// ============================================
// RESULT SCREEN
// ============================================
function showResult(challengeId, data) {
  showScreen("resultScreen");

  switch(challengeId) {
    case "challenge1":
      showChallenge1Result(data);
      break;
    case "challenge2":
      showChallenge2Result(data);
      break;
    case "challenge3":
      showChallenge3Result(data);
      break;
    case "challenge4":
      showChallenge4Result(data);
      break;
  }
}

function showChallenge1Result(data) {
  $("resultBadge").innerHTML = '<span>🎯</span> <span>تم إرسال حلّك!</span>';
  $("resultIcon").textContent = "🎯";
  $("resultType").textContent = "مبتكر مشكلات";
  $("resultDesc").innerHTML = `
    لقد اخترت مشكلة <strong>${esc(data.problem.title)}</strong> لجمهور <strong>${esc(data.audience.title)}</strong>.
    <br><br>
    <strong>حلّك:</strong> ${esc(data.solution)}
    <br><br>
    الوقت المستخدم: ${Math.floor(data.timeUsed / 60)} دقيقة و ${data.timeUsed % 60} ثانية
  `;
  $("resultMatch").innerHTML = '💡 <strong>تذكّر:</strong> أبرز رواد الأعمال يبدأون بفهم المشكلة قبل الحل';

  $("scoreSection").innerHTML = `
    <h3 class="score-title">📊 تقييم الأداء</h3>
    ${GAME_DATA.challenge1.evaluationCriteria.map(c => {
      const score = Math.floor(Math.random() * 30) + 70;
      return `
        <div class="score-bar-container">
          <div class="score-bar-label">
            <span>${esc(c.name)}</span>
            <span>${score}%</span>
          </div>
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width: ${score}%"></div>
          </div>
        </div>
      `;
    }).join("")}
  `;
}

function showChallenge2Result(data) {
  const p = data.personality;
  $("resultBadge").innerHTML = '<span>⚡</span> <span>تحليل الشخصية الريادية</span>';
  $("resultIcon").textContent = p.icon;
  $("resultType").textContent = p.type;
  $("resultType").style.color = p.color;
  $("resultDesc").textContent = p.description;
  $("resultMatch").innerHTML = `🎯 <strong>أنت تشبه:</strong> ${esc(p.match)}`;

  $("scoreSection").innerHTML = `
    <h3 class="score-title">📊 ملخص القرارات</h3>
    <div style="text-align: center; margin-bottom: 20px;">
      <span style="font-size: 2rem; font-weight: 900; color: ${p.color};">${data.totalPoints}/${data.maxPoints}</span>
      <br>
      <span style="color: var(--muted); font-size: .9rem;">نقاط الأداء تحت الضغط</span>
    </div>
    ${data.decisions.map((d, i) => {
      const scenario = GAME_DATA.challenge2.scenarios[i];
      return `
        <div class="score-bar-container">
          <div class="score-bar-label">
            <span>${scenario.title}</span>
            <span>${d.points}/4 • ${d.timeUsed}s</span>
          </div>
          <div class="score-bar-track">
            <div class="score-bar-fill" style="width: ${d.points * 25}%; background: ${p.color}"></div>
          </div>
        </div>
      `;
    }).join("")}
  `;
}

function showChallenge3Result(data) {
  $("resultBadge").innerHTML = '<span>🏪</span> <span>خطة الإنقاذ</span>';
  $("resultIcon").textContent = "🔄";
  $("resultType").textContent = "محوّل استراتيجي";
  $("resultType").style.color = "var(--green)";
  $("resultDesc").innerHTML = `
    لقد اخترت <strong>${data.selectedPivots.length}</strong> نهج pivot لإنقاذ المتجر.
    <br><br>
    <strong>خطتك:</strong> ${esc(data.plan)}
    <br><br>
    الوقت المستخدم: ${Math.floor(data.timeUsed / 60)} دقيقة و ${data.timeUsed % 60} ثانية
  `;
  $("resultMatch").innerHTML = '💡 <strong>تذكّر:</strong> Pivot ليس هروبًا — هو تغيير استراتيجي بذكاء';

  const pivotNames = data.selectedPivots.map(id => {
    const pivot = GAME_DATA.challenge3.store.pivots.find(p => p.id === id);
    return pivot ? pivot.title : "";
  }).filter(Boolean);

  $("scoreSection").innerHTML = `
    <h3 class="score-title">📊 نهج الـ Pivot المختار</h3>
    <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-bottom: 20px;">
      ${pivotNames.map(name => `
        <span style="background: rgba(91,199,143,.15); color: var(--green); padding: 6px 16px; border-radius: 999px; font-size: .9rem;">
          ${esc(name)}
        </span>
      `).join("")}
    </div>
    <p style="text-align: center; color: var(--muted); font-size: .9rem;">
      النجاح في ريادة الأعمال ليس في تجنب الفشل، بل في كيفية التعامل معه
    </p>
  `;
}

function showChallenge4Result(data) {
  $("resultBadge").innerHTML = '<span>💬</span> <span>تحليل مهارات الإقناع</span>';
  $("resultIcon").textContent = "🎤";
  $("resultType").textContent = "مُقنع متعدد الأنماط";
  $("resultType").style.color = "var(--blue)";

  const filledResponses = data.responses.filter(r => r && r.trim()).length;
  $("resultDesc").innerHTML = `
    لقد تواصلت مع <strong>${filledResponses}</strong> من <strong>${data.personas.length}</strong> شخصيات مختلفة.
    <br>
    كل شخصية كانت تحتاج منطقًا وطريقة مختلفة — وهذه هي مهارة الإقناع الحقيقية.
  `;
  $("resultMatch").innerHTML = '💡 <strong>تذكّر:</strong> ليس هناك منطق واحد يصلح للجميع — الفهم العميق للعميل هو المفتاح';

  $("scoreSection").innerHTML = `
    <h3 class="score-title">📊 ردودك على الشخصيات</h3>
    ${data.personas.map((p, i) => `
      <div style="margin-bottom: 16px; padding: 12px; background: var(--bg-soft); border-radius: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <span>${p.icon}</span>
          <strong>${esc(p.name)}</strong>
          <span style="color: var(--muted); font-size: .8rem;">${esc(p.role)}</span>
        </div>
        <p style="font-size: .85rem; color: var(--muted); line-height: 1.6;">
          ${data.responses[i] ? esc(data.responses[i]) : '<em>لم يُجب</em>'}
        </p>
      </div>
    `).join("")}
  `;
}

// ============================================
// INITIALIZATION =====
// ============================================
function init() {
  renderLanding();
  renderAbout();
  renderMenu();
}

// Run on load
init();
