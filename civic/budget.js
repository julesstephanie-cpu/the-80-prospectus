/* Original calculator arithmetic and event handlers, with donor-book navigation adapters. */
(() => {
  var budgetStorage = window.organizingBudgetStorage;
  function syncBudgetPreset() {
    var nationalVisible = !document.getElementById('organizing-national').hidden;
    var empty = Number(document.getElementById('org-ed').value) === 0 &&
      Number(document.getElementById('org-rd').value) === 0;
    var selected = nationalVisible ? 'national' : (empty ? 'nothing' : 'single');
    document.querySelectorAll('#panel-budget [data-org-view]').forEach(function (button) {
      var active = button.getAttribute('data-org-view') === selected;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function showBudgetView(id) {
    document.querySelectorAll('#panel-budget > section.page').forEach(function (section) {
      section.hidden = section.id !== id;
    });
    syncBudgetPreset();
    window.scrollTo(0, 0);
  }
  document.querySelectorAll('#panel-budget [data-org-view]').forEach(function (button) {
    button.addEventListener('click', function () {
      var view = button.getAttribute('data-org-view');
      if (view === 'nothing') {
        document.getElementById('org-reset').click();
        document.getElementById('orgn-reset').click();
        showBudgetView('organizing');
      } else if (view === 'single') {
        document.getElementById('org-fill').click();
        showBudgetView('organizing');
      } else {
        showBudgetView('organizing-national');
      }
    });
  });

  var orgEd = document.getElementById("org-ed");
  var orgRd = document.getElementById("org-rd");
  if (orgEd && orgRd) {
    var ED_SALARY = 175000;
    var RD_SALARY = 60000;
    // Restore any saved state (survives bfcache and tab returns)
    try {
      var savedEd = budgetStorage.getItem("the80.org-ed");
      var savedRd = budgetStorage.getItem("the80.org-rd");
      if (savedEd !== null) orgEd.value = savedEd;
      if (savedRd !== null) orgRd.value = savedRd;
    } catch (e) {}
    function fmtMoney(n) {
      if (n >= 1000000) {
        var m = n / 1000000;
        return "$" + (m >= 10 ? m.toFixed(1) : m.toFixed(2)) + "M";
      }
      if (n >= 1000) {
        return "$" + Math.round(n / 1000) + "K";
      }
      return "$" + n;
    }
    var HC_LOAD = 0.25;
    function orgSliderFill(el) {
      var min = Number(el.min) || 0;
      var max = Number(el.max) || 100;
      var val = Number(el.value) || 0;
      var pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
      el.style.background = "linear-gradient(to right, var(--accent) 0%, var(--accent) " + pct + "%, var(--border) " + pct + "%, var(--border) 100%)";
    }
    function orgRender() {
      var ed = parseInt(orgEd.value, 10) || 0;
      var rd = parseInt(orgRd.value, 10) || 0;
      orgSliderFill(orgEd); orgSliderFill(orgRd);
      try {
        budgetStorage.setItem("the80.org-ed", String(ed));
        budgetStorage.setItem("the80.org-rd", String(rd));
      } catch (e) {}
      var edCost = ed * ED_SALARY;
      var rdCost = rd * RD_SALARY;
      var salaryCost = edCost + rdCost;
      var hcCost = Math.round(salaryCost * HC_LOAD);
      var total = salaryCost + hcCost;
      document.getElementById("org-ed-value").textContent = ed;
      document.getElementById("org-rd-value").textContent = rd;
      document.getElementById("org-kpi-ed").textContent = fmtMoney(edCost);
      document.getElementById("org-kpi-rd").textContent = fmtMoney(rdCost);
      document.getElementById("org-kpi-hc").textContent = fmtMoney(hcCost);
      document.getElementById("org-kpi-total").textContent = fmtMoney(total);
      document.getElementById("org-ed-basis").textContent = ed;
      document.getElementById("org-rd-basis").textContent = rd;
      document.getElementById("org-ed-line").textContent = fmtMoney(edCost);
      document.getElementById("org-rd-line").textContent = fmtMoney(rdCost);
      document.getElementById("org-hc-line").textContent = fmtMoney(hcCost);
      document.getElementById("org-total-line").textContent = fmtMoney(total);
      syncBudgetPreset();
    }
    orgEd.addEventListener("input", orgRender);
    orgRd.addEventListener("input", orgRender);
    var orgReset = document.getElementById("org-reset");
    if (orgReset) {
      orgReset.addEventListener("click", function () {
        orgEd.value = 0;
        orgRd.value = 0;
        orgRender();
      });
    }
    var orgFill = document.getElementById("org-fill");
    if (orgFill) {
      orgFill.addEventListener("click", function () {
        orgEd.value = orgEd.max;
        orgRd.value = 12;
        orgRender();
      });
    }
    orgRender();
  }

  // ---- Organizers tab: Full National Deployment ----
  var orgnEd = document.getElementById("orgn-ed");
  var orgnRd = document.getElementById("orgn-rd");
  if (orgnEd && orgnRd) {
    var ORGN_ED_SALARY = 175000;
    var ORGN_RD_SALARY = 60000;
    var ORGN_HC_LOAD = 0.25;
    var ORGN_RD_PER_STATE = 12;
    // RD slider index 0..11 -> stops [0,12,24,36,48,60,72,84,96,108,120,132]
    function orgnFmtMoney(n) {
      if (n >= 1000000) {
        var m = n / 1000000;
        return "$" + (m >= 10 ? m.toFixed(1) : m.toFixed(2)) + "M";
      }
      if (n >= 1000) {
        return "$" + Math.round(n / 1000) + "K";
      }
      return "$" + n;
    }
    try {
      var savedOrgnEd = budgetStorage.getItem("the80.orgn-ed");
      var savedOrgnRdIdx = budgetStorage.getItem("the80.orgn-rd-idx");
      if (savedOrgnEd !== null) {
        var oe = Math.min(Math.max(Number(savedOrgnEd), 0), 6);
        orgnEd.value = String(oe);
      }
      if (savedOrgnRdIdx !== null) {
        var ori = Math.min(Math.max(Number(savedOrgnRdIdx), 0), 12);
        orgnRd.value = String(ori);
      }
    } catch (e) {}
    function orgnSliderFill(el) {
      var min = Number(el.min) || 0;
      var max = Number(el.max) || 100;
      var val = Number(el.value) || 0;
      var pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
      el.style.background = "linear-gradient(to right, var(--accent) 0%, var(--accent) " + pct + "%, var(--border) " + pct + "%, var(--border) 100%)";
    }
    function orgnRender() {
      var stateIdx = parseInt(orgnEd.value, 10) || 0;
      var rdIdx = parseInt(orgnRd.value, 10) || 0;
      // Locked coupling up to state 6: RD idx follows ED idx.
      // Once at state 6, RD slider unlocks for headroom (idx 6..11 -> 72..132).
      if (stateIdx < 6) {
        rdIdx = stateIdx;
        orgnRd.value = String(rdIdx);
        orgnRd.setAttribute("disabled", "");
      } else {
        // At state 6, ensure RD idx is at least 6 (72 base)
        if (rdIdx < 6) { rdIdx = 6; orgnRd.value = "6"; }
        orgnRd.removeAttribute("disabled");
      }
      var edCount = stateIdx;
      var rdCount = rdIdx * ORGN_RD_PER_STATE;
      orgnSliderFill(orgnEd); orgnSliderFill(orgnRd);
      try {
        budgetStorage.setItem("the80.orgn-ed", String(stateIdx));
        budgetStorage.setItem("the80.orgn-rd-idx", String(rdIdx));
      } catch (e) {}
      var edCost = edCount * ORGN_ED_SALARY;
      var rdCost = rdCount * ORGN_RD_SALARY;
      var salaryCost = edCost + rdCost;
      var hcCost = Math.round(salaryCost * ORGN_HC_LOAD);
      var total = salaryCost + hcCost;
      document.getElementById("orgn-ed-value").textContent = edCount;
      var ORGN_STATES = ["AZ", "IA", "GA", "MI", "NC", "TX"];
      document.getElementById("orgn-states").textContent = stateIdx === 0 ? "" : "(" + ORGN_STATES.slice(0, stateIdx).join(", ") + ")";
      document.getElementById("orgn-rd-value").textContent = rdCount;
      document.getElementById("orgn-inputs-kicker").textContent = stateIdx === 0 ? "Inputs" : ("Inputs (" + stateIdx + ")");
      document.getElementById("orgn-kpi-ed").textContent = orgnFmtMoney(edCost);
      document.getElementById("orgn-kpi-rd").textContent = orgnFmtMoney(rdCost);
      document.getElementById("orgn-kpi-hc").textContent = orgnFmtMoney(hcCost);
      document.getElementById("orgn-kpi-total").textContent = orgnFmtMoney(total);
      document.getElementById("orgn-ed-basis").textContent = edCount;
      document.getElementById("orgn-rd-basis").textContent = rdCount;
      document.getElementById("orgn-ed-line").textContent = orgnFmtMoney(edCost);
      document.getElementById("orgn-rd-line").textContent = orgnFmtMoney(rdCost);
      document.getElementById("orgn-hc-line").textContent = orgnFmtMoney(hcCost);
      document.getElementById("orgn-total-line").textContent = orgnFmtMoney(total);
      syncBudgetPreset();
    }
    orgnEd.addEventListener("input", orgnRender);
    orgnRd.addEventListener("input", orgnRender);
    var orgnReset = document.getElementById("orgn-reset");
    if (orgnReset) {
      orgnReset.addEventListener("click", function () {
        orgnEd.value = 0;
        orgnRd.value = 0;
        orgnRender();
      });
    }
    var orgnFill = document.getElementById("orgn-fill");
    if (orgnFill) {
      orgnFill.addEventListener("click", function () {
        orgnEd.value = 6;
        orgnRd.value = 6;
        orgnRender();
      });
    }
    orgnRender();
  }

  
})();
