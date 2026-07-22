const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");

if (menuButton && menu) {
  menuButton.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.querySelector("span:first-child").textContent = open ? "Close" : "Menu";
    menuButton.querySelector("span:last-child").textContent = open ? "×" : "+";
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.querySelector("span:first-child").textContent = "Menu";
      menuButton.querySelector("span:last-child").textContent = "+";
    });
  });
}

const notes = {
  track: {
    id: "01",
    label: "Track",
    title: "A scorecard that stays out of the way.",
    text: "Fast score entry, side quests, and complete round history—built to keep the group moving instead of staring at a screen."
  },
  play: {
    id: "02",
    label: "Play",
    title: "The round is better together.",
    text: "Invite friends, run live rounds, build scramble teams, and watch the match update while everyone plays."
  },
  find: {
    id: "03",
    label: "Find",
    title: "Plans changed? Find another eighteen.",
    text: "Emergency 18 turns your location into a nearby-course search, with on-course GPS tools when it is time to play."
  },
  improve: {
    id: "04",
    label: "Improve",
    title: "Stats made for golfers, not spreadsheets.",
    text: "Keep a real golf bag, understand the numbers that matter, and turn every saved round into something useful next time."
  }
};

const tabs = [...document.querySelectorAll("[data-note]")];
const panel = document.querySelector("#product-note");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const note = notes[tab.dataset.note];
    if (!note || !panel) return;

    tabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute("aria-selected", String(active));
      item.querySelector("[data-symbol]").textContent = active ? "—" : "+";
    });

    panel.innerHTML = `
      <p>${note.id} / ${note.label}</p>
      <h3>${note.title}</h3>
      <div class="note-bottom">
        <p>${note.text}</p>
        <span class="note-number" aria-hidden="true">${note.id}</span>
      </div>`;
    panel.animate(
      [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
      { duration: 380, easing: "cubic-bezier(.2,.8,.2,1)" }
    );
  });
});
