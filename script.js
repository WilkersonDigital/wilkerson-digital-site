const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

if (menuButton && menu) {
  const closeMenu = () => {
    menu.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.querySelector("span:first-child").textContent = "Menu";
    menuButton.querySelector("span:last-child").textContent = "+";
  };

  menuButton.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector("span:first-child").textContent = open ? "Close" : "Menu";
    menuButton.querySelector("span:last-child").textContent = open ? "×" : "+";
  });
  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  window.addEventListener("resize", closeMenu);
}

const themes = {
  classic: { label: "Classic", image: "assets/screens/home-classic.webp" },
  cream: { label: "Cream", image: "assets/screens/home-cream.webp" },
  neon: { label: "Neon", image: "assets/screens/home-neon.webp" }
};
const themeImage = document.querySelector("[data-theme-image]");
const themeButtons = [...document.querySelectorAll("[data-theme]")];

themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selected = themes[button.dataset.theme];
    if (!selected || !themeImage) return;
    themeButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    themeImage.src = selected.image;
    themeImage.alt = `Emergency 18 ${selected.label} home screen`;
    themeImage.animate(
      [{ opacity: 0.28, transform: "scale(1.012)" }, { opacity: 1, transform: "scale(1)" }],
      { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });
});

const screens = {
  home: {
    number: "01",
    label: "Home",
    title: "The whole game, within reach.",
    text: "Start a round, reconnect with friends, revisit your history, and see how your game is moving—without a crowded dashboard.",
    image: "assets/screens/home-neon.webp",
    alt: "Emergency 18 Neon home screen"
  },
  score: {
    number: "02",
    label: "Live scoring",
    title: "Scoring that keeps the group moving.",
    text: "Fast score entry, shared live rounds, putting and fairway tracking, plus the details golfers actually want after the round.",
    image: "assets/screens/live-scorecard.webp",
    alt: "Emergency 18 live round scorecard"
  },
  range: {
    number: "03",
    label: "GPS range",
    title: "A better decision before the next shot.",
    text: "Tap or drag a target for live yardage, then match the distance against the carry numbers saved in your golf bag.",
    image: "assets/screens/gps-range.webp",
    alt: "Emergency 18 GPS range over a golf hole"
  }
};

const screenTabs = [...document.querySelectorAll("[data-screen]")];
const screenImage = document.querySelector("[data-screen-image]");
const screenMeta = document.querySelector("[data-screen-meta]");
const screenTitle = document.querySelector("[data-screen-title]");
const screenText = document.querySelector("[data-screen-text]");
const screenCount = document.querySelector("[data-screen-count]");

screenTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const selected = screens[tab.dataset.screen];
    if (!selected || !screenImage || !screenMeta || !screenTitle || !screenText || !screenCount) return;
    screenTabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.querySelector("[data-symbol]").textContent = active ? "—" : "+";
    });
    screenMeta.textContent = `${selected.number} / ${selected.label}`;
    screenTitle.textContent = selected.title;
    screenText.textContent = selected.text;
    screenCount.textContent = selected.number;
    screenImage.src = selected.image;
    screenImage.alt = selected.alt;
    [screenImage, screenMeta, screenTitle, screenText].forEach((element) => {
      element.animate(
        [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
        { duration: 440, easing: "cubic-bezier(.2,.8,.2,1)" }
      );
    });
  });
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (reducedMotion) {
  document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")),
    { threshold: 0.12 }
  );
  document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
}
