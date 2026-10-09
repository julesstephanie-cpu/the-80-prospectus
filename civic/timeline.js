(() => {
  const milestones = [
    {
      month: 3,
      phase: "Stand up the beachhead",
      status: "The pilot state has a clear owner, an agreed plan, and an initial presence in the highest-leverage counties. The full-state staffing illustration is a destination to plan toward, not a day-one hiring requirement.",
      activity: [
        "Confirm state and local partnerships, responsibilities, and priority regions.",
        "Recruit the Executive Director and initial regionally rooted leadership.",
        "Assess local party health, candidate opportunities, and existing volunteer capacity.",
        "Approve a phased staffing budget and establish centrally supported organizing tools.",
        "Start weekly coordination and plan monthly in-person training."
      ],
      outcomes: [
        "An accountable state lead and initial regional team.",
        "A written beachhead plan with an approved budget.",
        "A baseline of local organizing capacity.",
        "Shared tools, records, and a working operating rhythm."
      ],
      gate: "Confirm leadership, partner readiness, tools, and funded scope before adding regional positions."
    },
    {
      month: 6,
      phase: "Test, learn, and adjust",
      status: "The beachhead has enough operating experience to assess what is working. Early proof means functioning teams, stronger relationships, candidate recruitment, and usable capacity, not a guaranteed election win.",
      activity: [
        "Recruit candidates for targeted down-ballot races and train local volunteers.",
        "Run recurring local organizing and community activity between elections.",
        "Review regional performance, tool usage, spending, and partner feedback.",
        "Adjust staffing, geography, and training where execution is weak.",
        "Document early proof points, lessons, and the cost of the next phase."
      ],
      outcomes: [
        "An initial candidate pipeline and active volunteer teams.",
        "Evidence of stronger local organizations and sustained participation.",
        "A written pilot review with spending and capacity measures.",
        "A revised plan for improvement or expansion."
      ],
      gate: "Expand only where the review supports it and the next stage is funded; otherwise strengthen the beachhead."
    },
    {
      month: 12,
      phase: "Expand on evidence",
      status: "Practices that work are extending into additional priority counties, at the pace the state can fund and manage. The first-year review distinguishes real organizing capacity from activity that has not produced durable value.",
      activity: [
        "Add Regional Directors and contracted field capacity where the plan justifies them.",
        "Extend candidate recruitment and volunteer training into additional target regions.",
        "Use shared research and messaging support without rebuilding a separate shop in each region.",
        "Develop local donor participation and fundraising for recurring community work.",
        "Review the first year's costs, outcomes, leadership, and unmet needs."
      ],
      outcomes: [
        "Wider coverage in approved priority counties.",
        "More trained volunteers and candidates for targeted races.",
        "A documented state playbook and first-year review.",
        "A costed second-year plan with clear capacity goals."
      ],
      gate: "Approve the next funding phase against demonstrated capacity and management readiness, not a uniform county formula."
    },
    {
      month: 18,
      phase: "Coordinate and sustain",
      status: "The state increasingly operates as a network rather than a set of isolated regions. Local leadership, institutional knowledge, and fundraising are developing alongside national support.",
      activity: [
        "Share specialist skills, successful practices, and staff support across regions.",
        "Prepare leadership continuity and recovery plans for vacancies or setbacks.",
        "Strengthen local fundraising and recurring community participation.",
        "Review whether coverage and volunteer capacity match the state's next priorities.",
        "Evaluate another state's readiness only where proof, leadership, and funding support replication."
      ],
      outcomes: [
        "A coordinated regional network with shared operating practices.",
        "More resilient local leadership and volunteer capacity.",
        "Evidence of growing local financial participation.",
        "A tested playbook and a selective replication assessment."
      ],
      gate: "Do not commit to another state at the expense of sustaining the first; assess each new opportunity independently."
    },
    {
      month: 24,
      phase: "Carry it forward",
      status: "The point of the investment is continuity. People, relationships, candidate pipelines, and operating knowledge carry into the next cycle, while statewide coverage remains a state-specific goal rather than a deadline assumed to be met.",
      activity: [
        "Review electoral outcomes alongside capacity, candidate development, and spending.",
        "Retain effective teams and correct leadership or programs that underperform.",
        "Refresh priorities and budgets using the previous two years of experience.",
        "Build the next phase of coverage and local self-sufficiency into the state plan.",
        "Share the lessons across funded states and with donors."
      ],
      outcomes: [
        "An organization that does not disappear after election day.",
        "A durable local leadership and candidate pipeline.",
        "A documented two-year learning and accountability record.",
        "A funded next-cycle plan and a realistic path toward full coverage."
      ],
      gate: "Renew, redesign, or stop specific investments based on evidence while preserving the durable capacity worth carrying forward."
    }
  ];
  const slider = document.getElementById("organizing-timeline");
  if (!slider) return;
  function fillList(id, items) {
    const list = document.getElementById(id);
    list.replaceChildren(...items.map(text => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    }));
  }
  function render(value) {
    const index = Math.min(4, Math.max(0, Number(value) || 0));
    const milestone = milestones[index];
    slider.value = String(index);
    slider.setAttribute("aria-valuetext", "By month " + milestone.month);
    document.getElementById("timeline-selected").textContent = "By month " + milestone.month;
    document.getElementById("timeline-month").textContent = "Month " + milestone.month;
    document.getElementById("timeline-phase").textContent = milestone.phase;
    document.getElementById("timeline-status-copy").textContent = milestone.status;
    document.getElementById("timeline-gate-copy").textContent = milestone.gate;
    fillList("timeline-activity", milestone.activity);
    fillList("timeline-outcomes", milestone.outcomes);
    document.querySelectorAll("[data-timeline-step]").forEach(button => {
      button.setAttribute("aria-pressed", String(Number(button.dataset.timelineStep) === index));
    });
    document.querySelectorAll("[data-timeline-row]").forEach(row => {
      row.dataset.current = String(Number(row.dataset.timelineRow) === index);
    });
  }
  slider.addEventListener("input", () => render(slider.value));
  function selectSummary(value) {
    render(value);
    document.querySelector(".timeline-control").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start"
    });
  }
  document.querySelectorAll("[data-timeline-step]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.closest("[data-timeline-row]")) {
        selectSummary(button.dataset.timelineStep);
      } else {
        render(button.dataset.timelineStep);
      }
    });
  });
  document.querySelectorAll("[data-timeline-row]").forEach(row => {
    row.addEventListener("click", event => {
      if (!event.target.closest("button")) selectSummary(row.dataset.timelineRow);
    });
  });
  render(0);
})();
