(function () {
  const app = document.querySelector(".app");
  const screens = Array.from(document.querySelectorAll(".screen"));
  const nav = document.querySelector(".bottom-nav");
  const navButtons = Array.from(document.querySelectorAll(".bottom-nav button"));
  const continueButton = document.querySelector(".continue");
  let selectedIdentity = null;

  function showScreen(name) {
    screens.forEach((screen) => {
      screen.classList.toggle("active", screen.dataset.screen === name);
    });

    nav.hidden = name === "start";
    navButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === name);
    });
    app.scrollTop = 0;
  }

  document.querySelectorAll(".identity-card").forEach((card) => {
    card.addEventListener("click", () => {
      selectedIdentity = card.dataset.identity;
      document.querySelectorAll(".identity-card").forEach((item) => {
        item.classList.toggle("selected", item === card);
      });
      continueButton.disabled = false;
      continueButton.classList.add("enabled");
    });
  });

  continueButton.addEventListener("click", () => {
    if (selectedIdentity) showScreen("map");
  });

  navButtons.forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.tab));
  });

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showScreen(button.dataset.go));
  });
})();
