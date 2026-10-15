document.addEventListener("DOMContentLoaded", function () {
  // Mobile Menu Toggle - Refactored for robustness
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    function toggleMenu() {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      // Prevent body scroll when menu is open
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    }

    navToggle.onclick = function(e) {
      e.stopPropagation();
      toggleMenu();
    };

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
      link.onclick = function() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      };
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  const navbar = document.querySelector(".navbar");
  // Check if navbar should be static (always dark/visible) or already light
  if (navbar && (navbar.classList.contains("navbar-static") || navbar.classList.contains("navbar-light"))) {
     // Already styled or static, no scroll effect needed usually
  } else if (navbar) {
      // Only add scroll listener if not static/pre-colored
      window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      });
  }
  // Dark Mode Logic
  const themeSwitch = document.getElementById('switch');
  const body = document.body;
  const currentTheme = localStorage.getItem('theme');

  // Check LocalStorage or System Preference (Only on index page)
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '/observatorio-estrategia-site/' || window.location.pathname.endsWith('index.html');
  
  if (isHomepage) {
    if (currentTheme) {
      if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeSwitch) themeSwitch.checked = true;
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      body.classList.add('dark-mode');
      if (themeSwitch) themeSwitch.checked = true;
    }
  } else {
      // Force light mode on all other pages regardless of preferences
      body.classList.remove('dark-mode');
      if (themeSwitch) themeSwitch.checked = false;
  }

  // Toggle Event Listener
  if (themeSwitch) {
      themeSwitch.addEventListener('change', function (e) {
        if (e.target.checked) {
          body.classList.add('dark-mode');
          localStorage.setItem('theme', 'dark');
        } else {
          body.classList.remove('dark-mode');
          localStorage.setItem('theme', 'light');
        }
      });
  }
});

/* --- Slider Automático --- */
document.addEventListener('DOMContentLoaded', function() {
    let slideIndex = 0;
    let slides = document.querySelectorAll(".slide");
    let dots = document.querySelectorAll(".dot");
    let slideInterval;

    function showSlides(n) {
        if (!slides.length) return;
        
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        
        slideIndex = n;
        if (slideIndex >= slides.length) {slideIndex = 0}
        if (slideIndex < 0) {slideIndex = slides.length - 1}
        
        slides[slideIndex].classList.add("active");
        dots[slideIndex].classList.add("active");
    }

    function startSlider() {
        if (slides.length > 1) {
            slideInterval = setInterval(() => { showSlides(slideIndex + 1); }, 6000); // 6 segundos
        }
    }

    // Nova função para as setas
    window.changeSlide = function(n) {
        clearInterval(slideInterval);
        showSlides(slideIndex + n);
        startSlider();
    };

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            clearInterval(slideInterval);
            showSlides(index);
            startSlider();
        });
    });

    // Event listeners for arrows (using data-dir to avoid inline onclick if possible, but user asked for global fn)
    // We can also bind the arrows if they exist
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    if (prevBtn) prevBtn.addEventListener("click", () => window.changeSlide(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => window.changeSlide(1));

    if (slides.length > 0) {
        showSlides(0);
        startSlider();
    }
});

// === Gerenciamento de Idioma / Google Translate ===

// Limpa completamente o cookie 'googtrans' em todos os caminhos e subdomínios possíveis
function clearGoogleTranslateCookies() {
    const expires = "expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0;";
    const paths = ["/", ""];

    // 1. Limpeza no escopo local (sem domínio explícito / host-only)
    paths.forEach(p => {
        document.cookie = "googtrans=; " + expires + " path=" + p + ";";
    });

    // 2. Limpeza em todas as variações de subdomínio e domínio raiz
    const host = window.location.hostname;
    const parts = host.split('.');
    while (parts.length > 1) {
        const domain = parts.join('.');
        paths.forEach(p => {
            document.cookie = "googtrans=; " + expires + " path=" + p + "; domain=" + domain + ";";
            document.cookie = "googtrans=; " + expires + " path=" + p + "; domain=." + domain + ";";
        });
        parts.shift();
    }

    // 3. Limpeza explícita para domínios de produção conhecidos
    paths.forEach(p => {
        document.cookie = "googtrans=; " + expires + " path=" + p + "; domain=observatoriodaestrategia.com;";
        document.cookie = "googtrans=; " + expires + " path=" + p + "; domain=.observatoriodaestrategia.com;";
        document.cookie = "googtrans=; " + expires + " path=" + p + "; domain=.vercel.app;";
    });
}

// Define o cookie 'googtrans' com consistência de domínio para persistência
function setGoogleTranslateCookie(targetLang) {
    const val = "/pt/" + targetLang;
    const paths = ["/"];
    paths.forEach(p => {
        document.cookie = "googtrans=" + val + "; path=" + p + ";";
    });
    const host = window.location.hostname;
    const parts = host.split('.');
    while (parts.length > 1) {
        const domain = parts.join('.');
        paths.forEach(p => {
            document.cookie = "googtrans=" + val + "; path=" + p + "; domain=" + domain + ";";
            document.cookie = "googtrans=" + val + "; path=" + p + "; domain=." + domain + ";";
        });
        parts.shift();
    }
}

// Aplica a seleção de idioma no widget nativo do Google
function triggerGoogleTranslateChange(lang) {
    const teCombo = document.querySelector('.goog-te-combo');
    if (!teCombo) return false;

    if (lang === 'pt') {
        teCombo.selectedIndex = 0;
        teCombo.value = '';
        teCombo.dispatchEvent(new Event('change'));
        return true;
    }

    let enIndex = -1;
    for (let i = 0; i < teCombo.options.length; i++) {
        let optVal = teCombo.options[i].value.toLowerCase();
        let optText = teCombo.options[i].text.toLowerCase();
        if (optVal === 'en' || optText.includes('inglês') || optText.includes('english')) {
            enIndex = i;
            break;
        }
    }
    if (enIndex !== -1) {
        teCombo.selectedIndex = enIndex;
    } else {
        teCombo.value = 'en';
    }
    teCombo.dispatchEvent(new Event('change'));
    return true;
}

// Alternar entre Português e Inglês
window.toggleLanguage = function() {
    const langBtn = document.getElementById('lang-toggle-btn');
    const savedLang = localStorage.getItem('siteLang') || 'pt';
    const btnText = langBtn ? langBtn.innerText.trim().toUpperCase() : '';

    // Se o site está em inglês (salvo como 'en' ou botão mostrando 'PT')
    const isCurrentlyEn = (savedLang === 'en' || btnText === 'PT');

    if (isCurrentlyEn) {
        // === RETORNAR PARA PORTUGUÊS (ORIGINAL) ===
        localStorage.setItem('siteLang', 'pt');
        if (langBtn) langBtn.innerText = 'EN';

        // 1. Limpa completamente todos os cookies googtrans em todos os domínios e caminhos
        clearGoogleTranslateCookies();

        // 2. Remove parâmetros residuais de hash na URL se existirem
        if (window.location.hash.includes('googtrans')) {
            history.replaceState("", document.title, window.location.pathname + window.location.search);
        }

        // 3. Reseta o combo do Google Translate se disponível
        triggerGoogleTranslateChange('pt');

        // 4. Recarrega a página de forma limpa para restaurar o DOM nativo sem tags do Google
        window.location.reload();
    } else {
        // === MUDAR PARA INGLÊS ===
        localStorage.setItem('siteLang', 'en');
        if (langBtn) langBtn.innerText = 'PT';

        // Define os cookies de tradução para inglês
        setGoogleTranslateCookie('en');

        // Dispara tradução imediatamente no combo do Google se já estiver pronto
        const triggered = triggerGoogleTranslateChange('en');
        if (!triggered) {
            window.location.reload();
        }
    }
};

// Ao carregar o script (IMEDIATAMENTE), assegura o estado correto do botão e limpa cookies se estiver em PT
(function() {
    const savedLang = localStorage.getItem('siteLang') || 'pt';
    const langBtn = document.getElementById('lang-toggle-btn');

    if (savedLang === 'en') {
        if (langBtn) langBtn.innerText = 'PT';
        setGoogleTranslateCookie('en');
    } else {
        if (langBtn) langBtn.innerText = 'EN';
        // Impede que o Google Translate auto-traduza com cookies obsoletos caso o usuário esteja em PT
        clearGoogleTranslateCookies();
    }
})();

// Garante sincronização de estado após carregamento total da página
window.addEventListener('load', function() {
    const savedLang = localStorage.getItem('siteLang') || 'pt';
    const langBtn = document.getElementById('lang-toggle-btn');

    if (savedLang === 'en') {
        if (langBtn) langBtn.innerText = 'PT';
        let checkGoogleLoad = setInterval(function() {
            const teCombo = document.querySelector('.goog-te-combo');
            if (teCombo) {
                clearInterval(checkGoogleLoad);
                triggerGoogleTranslateChange('en');
                if (langBtn) langBtn.innerText = 'PT';
            }
        }, 200);
        setTimeout(() => clearInterval(checkGoogleLoad), 6000);
    } else {
        if (langBtn) langBtn.innerText = 'EN';
        clearGoogleTranslateCookies();
    }
});
