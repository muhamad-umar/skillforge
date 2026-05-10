// ─── Mobile sidebar toggle ────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  const t = e.target.closest('[data-toggle-sidebar]');
  if (t) { document.querySelector('.sidebar')?.classList.toggle('open'); }
  if (!e.target.closest('.sidebar') && !e.target.closest('[data-toggle-sidebar]')) {
    document.querySelector('.sidebar')?.classList.remove('open');
  }
});

// ─── User personalisation ────────────────────────────────────────────────
function injectUserData(root) {
  const name = localStorage.getItem('sf_user_name');
  if (!name) return;
  const parts = name.trim().split(' ');
  const initials = parts.map(p => p[0]).join('').toUpperCase().slice(0, 2);
  const scope = root || document;

  scope.querySelectorAll('[data-user-name]').forEach(el => {
    el.textContent = el.dataset.userName.replace('{name}', name).replace('{first}', parts[0]);
  });

  scope.querySelectorAll('[data-user-initials]').forEach(el => {
    el.textContent = initials;
  });

  scope.querySelectorAll('[data-user-name-input]').forEach(el => {
    el.value = name;
  });
  scope.querySelectorAll('[data-user-email-input]').forEach(el => {
    el.value = localStorage.getItem('sf_user_email') || '';
  });

  // ─── Sidebar role correction (for shared pages like AI Assistant) ───────
  const role = localStorage.getItem('sf_user_role');
  const sidebarGroup = document.querySelector('.sidebar .group');
  if (role === 'instructor' && sidebarGroup && sidebarGroup.textContent === 'Learner') {
    sidebarGroup.textContent = 'Instructor';
    const nav = document.querySelector('.sidebar .nav');
    if (nav) {
      nav.innerHTML = `
        <a href="../instructor/instructor_dashboard.html" class=""><span>🏠</span><span>Dashboard</span></a>
        <a href="../instructor/manage_classes.html" class=""><span>🎓</span><span>My Classes</span></a>
        <a href="../instructor/review_submissions.html" class=""><span>📋</span><span>Submissions</span></a>
        <a href="ai_assistant.html" class="active"><span>🤖</span><span>AI Assistant</span></a>
      `;
    }
  }

}
injectUserData();

// ─── Ensure AI Assistant FAB exists ──────────────────────────────────────
function syncFAB() {
  const isAIPage = location.pathname.includes('ai_assistant.html');
  const isAdmin = location.pathname.includes('/admin/');
  const isDashboard = location.pathname.includes('/learner/') || location.pathname.includes('/instructor/') || isAdmin;

  let fab = document.querySelector('.fab');

  // Only show on Learner and Instructor dashboards (not Admin, not landing)
  if (isAIPage || isAdmin || !isDashboard) {
    if (fab) fab.remove();
    return;
  }

  // If fab exists but is not a direct child of body, move it to body
  if (fab && fab.parentElement !== document.body) {
    document.body.appendChild(fab);
  }

  if (!fab) {
    fab = document.createElement('a');
    fab.className = 'fab';
    fab.title = 'Open AI assistant';
    fab.innerHTML = '🤖';
    document.body.appendChild(fab);
  }
  // Dynamic link based on current path
  fab.href = (location.pathname.includes('/learner/') ? '' : '../learner/') + 'ai_assistant.html';
  // Ensure it has high z-index and is fixed
  fab.style.zIndex = '1000';
}
syncFAB();

// ─── Clear session on logout ─────────────────────────────────────────────
document.addEventListener('click', (e) => {
  if (e.target.closest('.logout-link')) {
    localStorage.removeItem('sf_user_name');
    localStorage.removeItem('sf_user_role');
    localStorage.removeItem('sf_user_email');
  }
});

// ─── Animate progress bars on load ───────────────────────────────────────
function animatePageExtras(root) {
  (root || document).querySelectorAll('.progress > span').forEach(s => {
    const w = s.dataset.w || s.style.getPropertyValue('--w') || s.style.width;
    s.style.width = '0';
    requestAnimationFrame(() => setTimeout(() => s.style.width = w, 80));
  });
  (root || document).querySelectorAll('[data-count]').forEach(el => {
    const target = parseFloat(el.dataset.count);
    const dur = 1500; const start = performance.now();
    const suffix = el.dataset.suffix || '';
    function tick(t) {
      const p = Math.min(1, (t - start) / dur);
      const v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = (target % 1 === 0 ? Math.floor(v) : v.toFixed(1)).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
window.addEventListener('load', () => animatePageExtras());

// ─── SPA Router ──────────────────────────────────────────────────────────
(function () {
  const contentEl = () => document.querySelector('main.content');
  const navLinks = () => document.querySelectorAll('.sidebar .nav a');

  // Only intercept links that are in the same directory (same dashboard role)
  function isSameDir(href) {
    if (!href) return false;
    if (href.startsWith('http') || href.startsWith('//')) return false;
    if (href.startsWith('../') || href.startsWith('/')) return false;
    // Exclude auth sign-out links
    if (href.includes('login.html') || href.includes('signup.html')) return false;
    return true;
  }

  function setActive(href) {
    navLinks().forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === href);
    });
  }

  async function navigate(href, pushState = true) {
    const main = contentEl();
    const app = document.querySelector('.app');
    const rightPanel = document.querySelector('.right-panel');
    if (!main || !app) return;

    // Fade-out current content
    main.classList.add('content-loading');

    try {
      const res = await fetch(href);
      const html = await res.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const newMain = doc.querySelector('main.content');
      const newApp = doc.querySelector('.app');
      const newRight = doc.querySelector('.right-panel');
      const newTitle = doc.querySelector('title')?.textContent;

      if (newMain) {
        // Wait for fade-out to be noticeable
        await new Promise(r => setTimeout(r, 150));

        // 1. Sync CSS links (and wait for them to load to avoid FOUC)
        const currentLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.getAttribute('href'));
        const newLinks = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
        const loadPromises = [];

        newLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (!currentLinks.includes(href)) {
            const l = document.createElement('link');
            l.rel = 'stylesheet';
            l.href = href;
            loadPromises.push(new Promise((resolve) => {
              l.onload = resolve;
              l.onerror = resolve; // Continue even if one fails
            }));
            document.head.appendChild(l);
          }
        });

        // Wait for all new styles to be ready
        if (loadPromises.length > 0) await Promise.all(loadPromises);

        // 2. Sync App Class
        if (newApp) app.className = newApp.className;

        // 3. Sync Right Panel
        if (rightPanel) {
          if (newRight) {
            rightPanel.style.display = '';
            rightPanel.innerHTML = newRight.innerHTML;
            // Copy style attribute if any
            if (newRight.hasAttribute('style')) rightPanel.setAttribute('style', newRight.getAttribute('style'));
          } else {
            rightPanel.style.display = 'none';
          }
        } else if (newRight && app) {
          const aside = document.createElement('aside');
          aside.className = 'right-panel';
          if (newRight.hasAttribute('style')) aside.setAttribute('style', newRight.getAttribute('style'));
          aside.innerHTML = newRight.innerHTML;
          app.appendChild(aside);
        }

        // 4. Swap main content
        main.innerHTML = newMain.innerHTML;

        // 5. Execute Scripts in new content
        const scripts = main.querySelectorAll('script');
        scripts.forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value));
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // Update page title
        if (newTitle) document.title = newTitle;

        // Update active state
        setActive(href);

        // Push history
        if (pushState) {
          history.pushState({ href }, newTitle || '', href);
        }

        // Run animations and re-inject user data
        animatePageExtras(main);
        injectUserData(main);
        syncFAB();
        const activeRight = document.querySelector('.right-panel');
        if (activeRight && activeRight.style.display !== 'none') {
          injectUserData(activeRight);
          animatePageExtras(activeRight);
        }

        // 6. Fade-in new content
        requestAnimationFrame(() => {
          main.classList.remove('content-loading');
          
          // 7. Apply staggered entrance to sections/cards AFTER showing the main container
          const elements = main.querySelectorAll('section, .card, .hero-card, article, .quest');
          elements.forEach((el, i) => {
            el.classList.add('fade-up-stagger');
            el.style.animationDelay = (i * 0.05) + 's';
          });
        });

        // Scroll content area to top
        main.closest('.main')?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Navigation error:', err);
      location.href = href;
    }
  }

  // Intercept sidebar nav clicks
  document.addEventListener('click', (e) => {
    const link = e.target.closest('.sidebar .nav a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!isSameDir(href)) return;
    e.preventDefault();
    navigate(href);
  });

  // Handle browser back/forward
  window.addEventListener('popstate', (e) => {
    if (e.state?.href) navigate(e.state.href, false);
  });

  // Record initial state so back button can return here
  history.replaceState({ href: location.pathname.split('/').pop() || 'index.html' }, document.title, '');
})();
