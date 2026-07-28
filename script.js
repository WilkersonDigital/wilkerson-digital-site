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
  };

  themeButtons.forEach((button) => button.addEventListener('click', () => setTheme(button.dataset.themeButton)));

  const waitlistRpcBase = 'https://xahdxubruhwqacumnnuy.supabase.co/rest/v1/rpc';
  const waitlistPublicKey = 'sb_publishable_MJP8KWnubjh4EKQgCqlrzw_XcPvinkq';
  const waitlistForm = document.querySelector('[data-waitlist-form]');
  const waitlistCount = document.querySelector('[data-waitlist-count]');
  const waitlistCountLabel = document.querySelector('[data-waitlist-count-label]');
  const waitlistMessage = document.querySelector('[data-waitlist-message]');

  const waitlistHeaders = {
    apikey: waitlistPublicKey,
    Authorization: `Bearer ${waitlistPublicKey}`,
    'Content-Type': 'application/json',
  };

  const setWaitlistCount = (value) => {
    const count = Number(value);
    if (!Number.isFinite(count) || !waitlistCount || !waitlistCountLabel) return;
    waitlistCount.textContent = String(count);
    waitlistCountLabel.textContent = count === 1 ? 'golfer is waiting' : 'golfers are waiting';
  };

  const setWaitlistMessage = (state, message) => {
    if (!waitlistMessage) return;
    waitlistMessage.className = `waitlist-message ${state}`;
    waitlistMessage.textContent = message;
  };

  fetch(`${waitlistRpcBase}/waitlist_public_count`, {
    method: 'POST',
    headers: waitlistHeaders,
    body: '{}',
  })
    .then((response) => {
      if (!response.ok) throw new Error('Count unavailable');
      return response.json();
    })
    .then((value) => setWaitlistCount(Array.isArray(value) ? value[0] : value))
    .catch(() => undefined);

  waitlistForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (String(data.get('company') || '').trim()) return;
    const email = String(data.get('email') || '').trim();
    if (!email) return;
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.firstChild.textContent = 'Joining… ';

    try {
      const response = await fetch(`${waitlistRpcBase}/join_launch_waitlist`, {
        method: 'POST',
        headers: waitlistHeaders,
        body: JSON.stringify({ p_email: email }),
      });
      if (!response.ok) throw new Error('Join unavailable');
      const payload = await response.json();
      const result = Array.isArray(payload) ? payload[0] : payload;
      setWaitlistCount(result?.total_count);
      setWaitlistMessage(result?.joined ? 'joined' : 'duplicate', result?.joined
        ? 'You’re in. We’ll email you when launch gets close.'
        : 'You’re already on the list—we’ve got you.');
      form.reset();
    } catch {
      setWaitlistMessage('error', 'The list is temporarily unavailable. Email business@wilkersondigital.net.');
    } finally {
      button.disabled = false;
      button.firstChild.textContent = 'Join the waitlist ';
    }
  });
})();
