(() => {
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  }, { rootMargin: '0px 0px -8%', threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((item) => revealObserver.observe(item));

  const heroVisual = document.querySelector('.hero-visual');
  heroVisual?.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const rect = heroVisual.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    heroVisual.style.setProperty('--hero-x', `${(x * 7).toFixed(2)}px`);
    heroVisual.style.setProperty('--hero-y', `${(y * 5).toFixed(2)}px`);
  });
  heroVisual?.addEventListener('pointerleave', () => {
    heroVisual.style.setProperty('--hero-x', '0px');
    heroVisual.style.setProperty('--hero-y', '0px');
  });

  const themes = [
    { id: 'classic', label: 'Classic', src: 'assets/screens/home-classic.webp' },
    { id: 'cream', label: 'Cream', src: 'assets/screens/home-cream.webp' },
    { id: 'neon', label: 'Neon', src: 'assets/screens/home-neon.webp' },
  ];

  const heldScreen = document.querySelector('[data-held-screen]');
  const rearLeft = document.querySelector('[data-rear-left]');
  const rearRight = document.querySelector('[data-rear-right]');
  const themeButtons = [...document.querySelectorAll('[data-theme-button]')];
  const styleCards = [...document.querySelectorAll('[data-style-card]')];

  const animateSwap = (element, distance = 12) => {
    if (!element || reducedMotion) return;
    element.animate(
      [{ opacity: 0, transform: `translateY(${distance}px) scale(.99)` }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
      { duration: 430, easing: 'cubic-bezier(.2,.8,.2,1)' },
    );
  };

  const setTheme = (id) => {
    const theme = themes.find((item) => item.id === id) || themes[0];
    const rear = themes.filter((item) => item.id !== theme.id);
    heldScreen.src = theme.src;
    heldScreen.alt = `Emergency 18 ${theme.label} home screen`;
    rearLeft.src = rear[0].src;
    rearRight.src = rear[1].src;
    animateSwap(heldScreen);
    animateSwap(rearLeft, 18);
    animateSwap(rearRight, 18);

    themeButtons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.themeButton === theme.id)));
    styleCards.forEach((card) => {
      const active = card.dataset.styleCard === theme.id;
      card.classList.toggle('is-active', active);
      card.setAttribute('aria-pressed', String(active));
      const label = card.querySelector('.style-card-action span');
      if (label) label.textContent = active ? 'Selected' : 'Bring forward';
    });
  };

  themeButtons.forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeButton)));
  styleCards.forEach((card) => card.addEventListener('click', () => setTheme(card.dataset.styleCard)));

  const features = [
    {
      number: '01', eyebrow: 'Your round starts here', title: 'Choose the round. Keep everything else out of the way.',
      copy: 'Solo, live, and scramble play begin from one focused home. Friends, recent form, and round history are close when you want them—not competing for every tap.',
      stat: '3', statLabel: 'ways to play', src: 'assets/screens/home-classic.webp', alt: 'Emergency 18 home screen in the Classic style',
    },
    {
      number: '02', eyebrow: 'Live scoring', title: 'The whole group stays on the same hole and the same page.',
      copy: 'Scores, putts, fairways, greens, and side quests update without slowing down the round. The scorecard is built for quick taps between shots.',
      stat: 'LIVE', statLabel: 'group scoring', src: 'assets/screens/live-scorecard.webp', alt: 'Emergency 18 live scoring screen with sample players Alex and Jordan',
    },
    {
      number: '03', eyebrow: 'GPS Range', title: 'Move the target. Trust the number. Pull a club.',
      copy: 'Tap a point on the hole, drag the pin to refine it, and get a carry recommendation from the clubs saved in your own Golf Bag.',
      stat: '156', statLabel: 'yards to target', src: 'assets/screens/gps-range.webp', alt: 'Emergency 18 GPS Range measuring a target on a golf hole',
    },
  ];

  const featureButtons = [...document.querySelectorAll('[data-feature-button]')];
  const tourScreen = document.querySelector('[data-tour-screen]');
  const tourCopyPanel = document.querySelector('.tour-copy');
  const fields = {
    number: document.querySelector('[data-tour-number]'),
    eyebrow: document.querySelector('[data-tour-eyebrow]'),
    title: document.querySelector('[data-tour-title]'),
    copy: document.querySelector('[data-tour-copy]'),
    stat: document.querySelector('[data-tour-stat]'),
    statLabel: document.querySelector('[data-tour-stat-label]'),
  };

  const setFeature = (index) => {
    const feature = features[index] || features[0];
    featureButtons.forEach((button, buttonIndex) => button.setAttribute('aria-selected', String(buttonIndex === index)));
    tourScreen.src = feature.src;
    tourScreen.alt = feature.alt;
    fields.number.textContent = feature.number;
    fields.eyebrow.textContent = feature.eyebrow;
    fields.title.textContent = feature.title;
    fields.copy.textContent = feature.copy;
    fields.stat.textContent = feature.stat;
    fields.statLabel.textContent = feature.statLabel;
    animateSwap(tourScreen, 22);
    animateSwap(tourCopyPanel, 15);
  };

  featureButtons.forEach((button, index) => button.addEventListener('click', () => setFeature(index)));
})();
