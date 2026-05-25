(function () {
  const screens = {
    onboarding: {
      file: "olympulse_role_selection.html",
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
    onboarding: "dashboard",
    dashboard: "delivery",
    delivery: "map",
    map: "event",
    event: "feedback",
    feedback: "insight",
    insight: "map",
  };

  const extraScreens = {
    dashboard: {
      file: "olympulse_dashboard.html",
    },
    delivery: {
      file: "olympulse_delivery_choice.html",
    },
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
    if (fromData && allScreens[fromData]) return fromData;

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

  function storedTheme() {
    const requestedTheme = new URLSearchParams(window.location.search).get("theme");
    if (requestedTheme === "light" || requestedTheme === "dark") return requestedTheme;

    try {
      return window.localStorage.getItem("olym-theme");
    } catch (error) {
      return null;
    }
  }

  function saveTheme(theme) {
    try {
      window.localStorage.setItem("olym-theme", theme);
    } catch (error) {
      // Theme still works for this page even when storage is unavailable.
    }
  }

  function themeIcon(isLight) {
    if (isLight) {
      return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M14.4 13.3A5.8 5.8 0 0 1 6.7 5.6 6.3 6.3 0 1 0 14.4 13.3Z"/></svg>';
    }

    return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3.3v2M10 14.7v2M4.8 4.8l1.4 1.4M13.8 13.8l1.4 1.4M3.3 10h2M14.7 10h2M4.8 15.2l1.4-1.4M13.8 6.2l1.4-1.4"/><circle cx="10" cy="10" r="2.7"/></svg>';
  }

  function applyTheme(isLight) {
    document.documentElement.classList.toggle("light-mode", isLight);
    document.body.classList.toggle("light-mode", isLight);
    document.querySelectorAll(".theme-toggle, .settings-button, .live-event-009").forEach((button) => {
      button.classList.add("theme-toggle");
      button.innerHTML = themeIcon(isLight);
      button.setAttribute("title", isLight ? "Switch to dark mode" : "Switch to light mode");
      button.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
      if (!button.getAttribute("type") && button.tagName === "BUTTON") button.type = "button";
    });
  }

  function installThemeToggle() {
    applyTheme(storedTheme() === "light");

    document.addEventListener("click", (event) => {
      const button = event.target.closest(".theme-toggle, .settings-button, .live-event-009");
      if (!button) return;
      event.preventDefault();
      const isLight = !document.body.classList.contains("light-mode");
      applyTheme(isLight);
      saveTheme(isLight ? "light" : "dark");
    });
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
    // Skip if a static nav is already in the page
    if (document.querySelector('.static-nav')) return;
    removeLegacyNav();
    flattenScreenChrome();

    const active = currentScreen();
    const isOnboarding = document.body.dataset.screen === "onboarding" ||
      window.location.pathname.includes("role_selection") ||
      window.location.pathname.includes("onboarding");
    if (isOnboarding) return;

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
      const routeOption = event.target.closest("[data-route-option]");
      if (routeOption) {
        event.preventDefault();
        selectRouteOption(routeOption);
        return;
      }

      const target = event.target.closest("[data-next-screen]");
      if (!target) return;
      event.preventDefault();
      navigateTo(target.dataset.nextScreen);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;

      const routeOption = event.target.closest("[data-route-option]");
      if (routeOption) {
        event.preventDefault();
        selectRouteOption(routeOption);
        return;
      }

      const target = event.target.closest("[data-next-screen]");
      if (!target && !routeOption) return;
      event.preventDefault();
      if (target) navigateTo(target.dataset.nextScreen);
    });
  }

  function selectRouteOption(selected) {
    const group = selected.closest("[role='radiogroup']") || document;
    group.querySelectorAll("[data-route-option]").forEach((option) => {
      const isSelected = option === selected;
      option.classList.toggle("is-selected", isSelected);
      option.setAttribute("aria-checked", String(isSelected));
    });
    // Navigate to route trade-off screen after a brief visual delay
    setTimeout(() => navigateTo("routeSelected"), 260);
  }

  function installPromptBridge() {
    window.sendPrompt = function (message) {
      const screen = currentScreen();
      const normalized = String(message || "").toLowerCase();

      if (normalized.includes("live event")) return navigateTo("event");
      if (normalized.includes("回饋")) return navigateTo("feedback");
      if (normalized.includes("personal insight") || normalized.includes("最後")) return navigateTo("insight");
      if (normalized.includes("main map") || normalized.includes("主地圖") || normalized.includes("地圖")) return navigateTo("map");
      if (normalized.includes("dashboard") || normalized.includes("home") || normalized.includes("what do you need")) return navigateTo("dashboard");

      navigateTo(storyNext[screen] || "map");
    };

    window.olympulseNavigate = navigateTo;
    window.olympulseAddNav = addNav;
  }

  installPromptBridge();
  wireStoryFlow();
  applyTheme(storedTheme() === "light");

  function installBrandHomeLink() {
    const screen = currentScreen();
    if (screen === "onboarding") return;

    // Standard screens use .app-header; personal insight uses .personal-insight-001
    const header = document.querySelector(".app-header") ||
                   document.querySelector(".personal-insight-001");
    if (!header) return;

    // Only make the brand/logo portion clickable (left side), not the whole header
    const brandEl = header.querySelector(".brand") ||
                    document.querySelector(".personal-insight-002");
    const target = brandEl || header;

    target.style.cursor = "pointer";
    target.title = "Back to start";
    target.addEventListener("click", (e) => {
      if (e.target.closest(".theme-toggle, .settings-button, .personal-insight-005, .personal-insight-actions, .delivery-settings-btn")) return;
      navigateTo("onboarding");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    installThemeToggle();
    addNav();
    installBrandHomeLink();
  });
})();
