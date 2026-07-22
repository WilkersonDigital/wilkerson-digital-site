(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');

  const setMenu = (open) => {
    if (!menuButton || !menu) return;
    menu.classList.toggle('is-open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.children[0].textContent = open ? 'Close' : 'Menu';
    menuButton.children[1].textContent = open ? '×' : '+';
  };

  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));

  const updateProgress = () => {
    const height = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll-progress', String(height > 0 ? window.scrollY / height : 0));
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.setAttribute('data-visible', 'true');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10%', threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((item) => revealObserver.observe(item));

  const featureScreens = [...document.querySelectorAll('[data-feature-screen]')];
  const featureSteps = [...document.querySelectorAll('[data-feature-step]')];
  const number = document.querySelector('[data-feature-number]');
  const eyebrow = document.querySelector('[data-feature-eyebrow]');
  const activateFeature = (index) => {
    featureScreens.forEach((screen, i) => {
      screen.classList.toggle('is-active', i === index);
      screen.alt = i === index ? ['Emergency 18 Classic home screen', 'Emergency 18 live scoring with two sample players', 'Emergency 18 GPS Range on a golf hole'][i] : '';
    });
    featureSteps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    if (number) number.textContent = featureSteps[index]?.dataset.number || '';
    if (eyebrow) eyebrow.textContent = featureSteps[index]?.dataset.eyebrow || '';
  };
  const featureObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) activateFeature(Number(visible.target.dataset.featureStep));
  }, { rootMargin: '-28% 0px -46%', threshold: [0.05, 0.25, 0.55] });
  featureSteps.forEach((step) => featureObserver.observe(step));

  const themeTabs = [...document.querySelectorAll('[data-theme-tab]')];
  const themeStage = document.querySelector('.theme-stage');
  const themeScreen = document.querySelector('[data-theme-screen]');
  const themeWord = document.querySelector('.theme-word');
  themeTabs.forEach((tab) => tab.addEventListener('click', () => {
    themeTabs.forEach((item) => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.lastElementChild.textContent = active ? '—' : '+';
    });
    themeStage.dataset.theme = tab.dataset.themeTab;
    themeScreen.src = tab.dataset.src;
    themeScreen.alt = `Emergency 18 ${tab.textContent.replace(/[—+]/g, '').trim()} home screen`;
    themeWord.textContent = tab.textContent.replace(/[—+]/g, '').trim();
    themeScreen.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
  }));
})();
