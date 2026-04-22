(function () {
  const screens = {
    onboarding: {
      file: "olympulse_onboarding.html",
      label: "Start",
      colorClass: "is-onboarding-active",
    },
    map: {
      file: "olympulse_main_map_v2.html",
      label: "Map",
    },
    event: {
      file: "olympulse_live_event_mode.html",
      label: "Events",
      colorClass: "is-event-active",
    },
    feedback: {
      file: "olympulse_feedback.html",
      label: "Report",
      colorClass: "is-feedback-active",
    },
    insight: {
      file: "olympulse_personal_insight.html",
      label: "Insights",
    },
  };

  const storyNext = {
    onboarding: "map",
    map: "event",
    event: "feedback",
    feedback: "insight",
    insight: "map",
  };

  const extraScreens = {
    routeSelected: {
      file: "olympulse_route_selected.html",
    },
    liveReroute: {
      file: "olympulse_live_reroute.html",
    },
  };

  const allScreens = {
    ...screens,
    ...extraScreens,
  };

  const filenameToScreen = Object.entries(allScreens).reduce((acc, [screen, config]) => {
    acc[config.file] = screen;
    return acc;
  }, {});

  function currentScreen() {
    const fromData = document.body && document.body.dataset.screen;
    if (fromData && screens[fromData]) return fromData;

    const filename = window.location.pathname.split("/").pop();
    return filenameToScreen[filename] || "onboarding";
  }

  function navigateTo(screen) {
    if (!allScreens[screen]) return;

    if (window.parent && window.parent !== window && window.parent.OlymPulseFrame) {
      window.parent.OlymPulseFrame.navigate(screen);
      return;
    }

    document.body.classList.add("is-transitioning");
    window.setTimeout(() => {
      window.location.href = allScreens[screen].file;
    }, 180);
  }

  function icon(name) {
    const icons = {
      onboarding:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2C6.24 2 4 4.24 4 7c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5z" stroke-width="1.3"/><circle class="nav-fill" cx="9" cy="7" r="1.6"/></svg>',
      map:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="7" stroke-width="1.3"/><circle class="nav-fill" cx="9" cy="9" r="2"/></svg>',
      event:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M9 2l1.5 4.5H15l-3.8 2.7 1.5 4.5L9 11l-3.7 2.7 1.5-4.5L3 6.5h4.5z" stroke-width="1.2" fill="none"/></svg>',
      feedback:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 5h12M3 9h8M3 13h10" stroke-width="1.2" stroke-linecap="round"/></svg>',
      insight:
        '<svg viewBox="0 0 18 18" fill="none" aria-hidden="true"><circle cx="9" cy="7" r="3" stroke-width="1.2"/><path d="M3 16c0-3.31 2.69-6 6-6s6 2.69 6 6" stroke-width="1.2" stroke-linecap="round"/></svg>',
    };

    return icons[name];
  }

  function removeLegacyNav() {
    const candidates = Array.from(document.querySelectorAll("div[style*='border-top']"));
    candidates.forEach((node) => {
      const text = node.textContent.replace(/\s+/g, " ").trim();
      if (text.includes("Map") && text.includes("Events") && text.includes("Profile")) {
        node.remove();
      }
    });
  }

  function visualChildren() {
    return Array.from(document.body.children).filter((node) => {
      return !["STYLE", "SCRIPT"].includes(node.tagName);
    });
  }

  function flattenScreenChrome() {
    const outer = visualChildren()[0];
    if (!outer || outer.tagName !== "DIV") return;

    const inner = outer.firstElementChild;
    const outerStyle = outer.getAttribute("style") || "";
    const innerStyle = inner ? inner.getAttribute("style") || "" : "";
    const isGeneratedShell =
      outerStyle.includes("max-width:360px") &&
      outerStyle.includes("padding") &&
      inner &&
      inner.tagName === "DIV" &&
      innerStyle.includes("border-radius") &&
      innerStyle.includes("border:");

    if (!isGeneratedShell) return;

    while (inner.firstChild) {
      document.body.insertBefore(inner.firstChild, outer);
    }

    outer.remove();
  }

  function addNav() {
    removeLegacyNav();
    flattenScreenChrome();

    const active = currentScreen();
    if (active === "onboarding") return;

    const nav = document.createElement("nav");
    nav.className = "olympulse-bottom-nav";
    nav.setAttribute("aria-label", "Prototype navigation");

    Object.keys(screens).forEach((screen) => {
      const config = screens[screen];
      const button = document.createElement("button");
      const isActive = screen === active;
      const activeClass = config.colorClass || "is-active";
      button.type = "button";
      button.className = `olympulse-bottom-nav__item${isActive ? ` is-active ${activeClass}` : ""}`;
      button.setAttribute("aria-current", isActive ? "page" : "false");
      button.innerHTML = `${icon(screen)}<span>${config.label}</span>`;
      button.addEventListener("click", () => navigateTo(screen));
      nav.appendChild(button);
    });

    document.body.appendChild(nav);
  }

  function wireStoryFlow() {
    document.addEventListener("click", (event) => {
      const target = event.target.closest("[data-next-screen]");
      if (!target) return;
      event.preventDefault();
      navigateTo(target.dataset.nextScreen);
    });
  }

  function installPromptBridge() {
    window.sendPrompt = function (message) {
      const screen = currentScreen();
      const normalized = String(message || "").toLowerCase();

      if (normalized.includes("live event")) return navigateTo("event");
      if (normalized.includes("回饋")) return navigateTo("feedback");
      if (normalized.includes("personal insight") || normalized.includes("最後")) return navigateTo("insight");
      if (normalized.includes("主地圖") || normalized.includes("地圖")) return navigateTo("map");

      navigateTo(storyNext[screen] || "map");
    };

    window.olympulseNavigate = navigateTo;
  }

  installPromptBridge();
  wireStoryFlow();

  document.addEventListener("DOMContentLoaded", addNav);
})();
