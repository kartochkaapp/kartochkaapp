(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll("[data-close-mobile-menu]");
  const authSection = document.getElementById("authSection");
  const authCloseBtn = document.getElementById("authCloseBtn");
  const googleAuthBtn = document.getElementById("googleAuthBtn");
  const authEmailLoginTab = document.getElementById("authEmailLoginTab");
  const authEmailRegisterTab = document.getElementById("authEmailRegisterTab");
  const authEmailLoginPanel = document.getElementById("authEmailLoginPanel");
  const authEmailRegisterPanel = document.getElementById("authEmailRegisterPanel");
  const authLoginEmailInput = document.getElementById("authLoginEmail");
  const authLoginPasswordInput = document.getElementById("authLoginPassword");
  const authRegisterEmailInput = document.getElementById("authRegisterEmail");
  const authRegisterPasswordInput = document.getElementById("authRegisterPassword");
  const authRegisterPasswordConfirmInput = document.getElementById("authRegisterPasswordConfirm");
  const emailLoginBtn = document.getElementById("emailLoginBtn");
  const emailRegisterBtn = document.getElementById("emailRegisterBtn");
  const authMessage = document.getElementById("authMessage");
  const authTriggers = document.querySelectorAll("[data-open-auth]");
  const cabinetBtn = document.querySelector(".topbar-actions [data-open-auth]");

  const APP_ROUTE_PREFIX = "#app/";
  const APP_MODES = ["create", "improve", "tools", "animate", "history"];

  let activeUser = null;

  const toText = (value) => String(value || "").trim();
  const toLowerText = (value) => toText(value).toLowerCase();

  const normalizeAppMode = (mode) => {
    return APP_MODES.includes(mode) ? mode : "create";
  };

  const setAuthMessage = (text, type) => {
    if (!authMessage) return;
    authMessage.textContent = toText(text);
    authMessage.classList.remove("is-error", "is-success");

    if (type === "error") authMessage.classList.add("is-error");
    if (type === "success") authMessage.classList.add("is-success");
  };

  const openAuthModal = () => {
    authSection?.classList.remove("hidden");
    authSection?.setAttribute("aria-hidden", "false");
    document.body.classList.add("auth-open");
  };

  const closeAuthModal = () => {
    authSection?.classList.add("hidden");
    authSection?.setAttribute("aria-hidden", "true");
    document.body.classList.remove("auth-open");
  };

  const setAuthMode = (mode) => {
    const normalizedMode = mode === "register" ? "register" : "login";
    const isRegister = normalizedMode === "register";
    authEmailLoginTab?.classList.toggle("active", !isRegister);
    authEmailRegisterTab?.classList.toggle("active", isRegister);
    authEmailLoginTab?.setAttribute("aria-selected", String(!isRegister));
    authEmailRegisterTab?.setAttribute("aria-selected", String(isRegister));
    authEmailLoginPanel?.classList.toggle("active", !isRegister);
    authEmailRegisterPanel?.classList.toggle("active", isRegister);
  };

  const setButtonsDisabled = (disabled) => {
    [googleAuthBtn, emailLoginBtn, emailRegisterBtn].forEach((button) => {
      if (!button) return;
      if (disabled) {
        button.setAttribute("disabled", "disabled");
      } else {
        button.removeAttribute("disabled");
      }
    });
  };

  const openMobileMenu = () => {
    mobileMenu?.classList.remove("hidden");
    mobileMenu?.setAttribute("aria-hidden", "false");
    mobileMenuBtn?.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  };

  const closeMobileMenu = () => {
    mobileMenu?.classList.add("hidden");
    mobileMenu?.setAttribute("aria-hidden", "true");
    mobileMenuBtn?.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  };

  const isLocalHostname = (hostname) => {
    const normalized = toLowerText(hostname);
    return normalized === "localhost"
      || normalized === "127.0.0.1"
      || normalized === "0.0.0.0"
      || normalized === "[::1]";
  };

  const isPreviewHostname = (hostname) => {
    const normalized = toLowerText(hostname);
    return normalized.endsWith(".vercel.app") || normalized.endsWith(".vercel.dev");
  };

  const resolveDedicatedAppBaseUrl = () => {
    const explicitBaseUrl = toText(window.KARTOCHKA_APP_BASE_URL).replace(/\/+$/, "");
    if (explicitBaseUrl) return explicitBaseUrl;
    return toText(window.location.origin);
  };

  const buildAppPath = (mode) => {
    const normalizedMode = normalizeAppMode(mode);
    return normalizedMode === "create" ? "/app" : "/app/" + normalizedMode;
  };

  const buildAppUrl = (mode) => {
    const dedicatedBaseUrl = resolveDedicatedAppBaseUrl();
    return dedicatedBaseUrl + buildAppPath(mode);
  };

  const redirectToApp = (mode, options) => {
    const targetUrl = buildAppUrl(mode);
    if (!targetUrl) return;

    if (Boolean(options && options.replace)) {
      window.location.replace(targetUrl);
      return;
    }

    window.location.assign(targetUrl);
  };

  const parseLegacyAppModeFromHash = () => {
    const sourceHash = toText(window.location.hash);
    if (!sourceHash.startsWith(APP_ROUTE_PREFIX)) return null;
    const mode = sourceHash.slice(APP_ROUTE_PREFIX.length).split(/[/?#]/)[0].trim().toLowerCase();
    return APP_MODES.includes(mode) ? mode : null;
  };

  const syncCabinetButton = (user) => {
    if (!cabinetBtn) return;

    cabinetBtn.textContent = "Личный кабинет";

    if (!user) {
      cabinetBtn.removeAttribute("title");
      return;
    }

    cabinetBtn.setAttribute("title", user.displayName || user.email || "Личный кабинет");
  };

  const firebaseConfig = {
    apiKey: "AIzaSyCOYK5xZ0fKwQSX64FgsCNGEepJV1xLY8o",
    authDomain: "kartochka1-a5f1b.firebaseapp.com",
    projectId: "kartochka1-a5f1b",
    storageBucket: "kartochka1-a5f1b.firebasestorage.app",
    messagingSenderId: "509819260153",
    appId: "1:509819260153:web:5ef8a90b9b24dc81aca628",
  };

  const hasFirebaseSdk = typeof window.firebase !== "undefined";
  const firebaseApp = hasFirebaseSdk
    ? window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig)
    : null;

  const auth = firebaseApp ? window.firebase.auth() : null;
  const googleProvider = auth ? new window.firebase.auth.GoogleAuthProvider() : null;

  if (auth) {
    auth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL).catch(() => {});
  }

  const mapAuthError = (error) => {
    const code = String(error?.code || "");
    if (code === "auth/popup-closed-by-user") return "Вход через Google отменен";
    if (code === "auth/popup-blocked") return "Браузер заблокировал окно входа";
    if (code === "auth/network-request-failed") return "Ошибка сети. Проверьте подключение";
    if (code === "auth/unauthorized-domain") return "Домен не добавлен в Firebase Authorized domains";
    if (code === "auth/invalid-email") return "Некорректный email";
    if (code === "auth/user-not-found") return "Аккаунт с таким email не найден";
    if (code === "auth/wrong-password") return "Неверный пароль";
    if (code === "auth/invalid-credential") return "Неверный email или пароль";
    if (code === "auth/email-already-in-use") return "Этот email уже используется";
    if (code === "auth/weak-password") return "Пароль слишком простой";
    if (code === "auth/too-many-requests") return "Слишком много попыток. Попробуйте позже";
    if (code === "auth/operation-not-allowed") return "В Firebase не включён вход по email и паролю";
    if (code === "auth/configuration-not-found") return "В Firebase не настроен способ входа по email и паролю";
    return error instanceof Error ? error.message : "Ошибка авторизации";
  };

  mobileMenuBtn?.addEventListener("click", openMobileMenu);
  mobileMenuClose?.addEventListener("click", closeMobileMenu);
  mobileMenuLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));

  mobileMenu?.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  authTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileMenu();

      if (activeUser) {
        redirectToApp("create");
        return;
      }

      openAuthModal();
    });
  });

  authCloseBtn?.addEventListener("click", closeAuthModal);
  authEmailLoginTab?.addEventListener("click", () => setAuthMode("login"));
  authEmailRegisterTab?.addEventListener("click", () => setAuthMode("register"));
  authSection?.addEventListener("click", (event) => {
    if (event.target === authSection) {
      closeAuthModal();
    }
  });

  if (!hasFirebaseSdk) {
    setAuthMessage("Firebase SDK не загружен", "error");
  }

  googleAuthBtn?.addEventListener("click", async () => {
    if (!auth || !googleProvider) {
      setAuthMessage("Google Auth недоступен: Firebase не подключен", "error");
      return;
    }

    setButtonsDisabled(true);
    setAuthMessage("Открываем Google-авторизацию...", "");

    try {
      const result = await auth.signInWithPopup(googleProvider);
      activeUser = result.user || null;
      syncCabinetButton(activeUser);
      setAuthMessage("Вход через Google выполнен", "success");
      redirectToApp("create", { replace: true });
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      setButtonsDisabled(false);
    }
  });

  authEmailLoginPanel?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!auth) {
      setAuthMessage("Email-авторизация недоступна: Firebase не подключен", "error");
      return;
    }

    const email = toText(authLoginEmailInput?.value);
    const password = toText(authLoginPasswordInput?.value);

    if (!email || !password) {
      setAuthMessage("Введите email и пароль", "error");
      return;
    }

    setButtonsDisabled(true);
    setAuthMessage("Проверяем данные и входим...", "");

    try {
      const result = await auth.signInWithEmailAndPassword(email, password);
      activeUser = result.user || null;
      syncCabinetButton(activeUser);
      setAuthMessage("Вход по email выполнен", "success");
      redirectToApp("create", { replace: true });
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      setButtonsDisabled(false);
    }
  });

  authEmailRegisterPanel?.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!auth) {
      setAuthMessage("Регистрация по email недоступна: Firebase не подключен", "error");
      return;
    }

    const email = toText(authRegisterEmailInput?.value);
    const password = toText(authRegisterPasswordInput?.value);
    const confirmPassword = toText(authRegisterPasswordConfirmInput?.value);

    if (!email || !password || !confirmPassword) {
      setAuthMessage("Заполните все поля регистрации", "error");
      return;
    }

    if (password.length < 6) {
      setAuthMessage("Пароль должен быть не короче 6 символов", "error");
      return;
    }

    if (password !== confirmPassword) {
      setAuthMessage("Пароли не совпадают", "error");
      return;
    }

    setButtonsDisabled(true);
    setAuthMessage("Создаём аккаунт...", "");

    try {
      const result = await auth.createUserWithEmailAndPassword(email, password);
      activeUser = result.user || null;
      syncCabinetButton(activeUser);
      setAuthMessage("Аккаунт создан, выполняем вход", "success");
      redirectToApp("create", { replace: true });
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      setButtonsDisabled(false);
    }
  });

  if (auth) {
    auth.onAuthStateChanged((user) => {
      activeUser = user || null;
      syncCabinetButton(user);
    });
  } else {
    syncCabinetButton(null);
  }

  const legacyAppMode = parseLegacyAppModeFromHash();
  if (legacyAppMode) {
    redirectToApp(legacyAppMode, { replace: true });
  }

  const quickStartSection = document.getElementById("start");
  const pricingIntroSection = document.querySelector(".pricing-intro");
  const pricingSection = document.getElementById("pricing");
  const pricingAnchor = pricingIntroSection || pricingSection;
  const pricingParent = pricingAnchor?.parentNode;

  if (quickStartSection && pricingAnchor && pricingParent) {
    pricingParent.insertBefore(quickStartSection, pricingAnchor);
  }

  const revealNodes = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealNodes.forEach((node) => observer.observe(node));
  } else {
    revealNodes.forEach((node) => node.classList.add("is-visible"));
  }

  const statsSection = document.querySelector(".kartochka-stats-section");
  if (statsSection) {
    const statsNumber = statsSection.querySelector(".kartochka-stats-number");
    const formatNumber = (value) => new Intl.NumberFormat("ru-RU").format(value).replace(/\u00A0/g, "\u00A0\u00A0");

    const revealStats = () => {
      statsSection.classList.add("kartochka-stats-section-visible");
      if (!statsNumber || statsNumber.dataset.kartochkaStatsAnimated === "true") {
        return;
      }

      statsNumber.dataset.kartochkaStatsAnimated = "true";
      const targetValue = Number(statsNumber.dataset.kartochkaStatsTarget || "16348");

      if (prefersReducedMotion) {
        statsNumber.textContent = formatNumber(targetValue);
        return;
      }

      const duration = 1500;
      const easeOut = (progress) => 1 - Math.pow(1 - progress, 3);
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const nextValue = Math.round(targetValue * easeOut(progress));
        statsNumber.textContent = formatNumber(nextValue);

        if (progress < 1) {
          requestAnimationFrame(tick);
          return;
        }

        statsNumber.textContent = formatNumber(targetValue);
      };

      requestAnimationFrame(tick);
    };

    if ("IntersectionObserver" in window) {
      const statsObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              revealStats();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -10% 0px" }
      );
      statsObserver.observe(statsSection);
    } else {
      revealStats();
    }
  }

  const topbar = document.querySelector(".topbar");
  if (topbar) {
    let lastScrollY = window.scrollY;

    const syncTopbarVisibility = () => {
      if (document.body.classList.contains("menu-open") || document.body.classList.contains("auth-open")) {
        topbar.classList.remove("topbar-hidden");
        lastScrollY = window.scrollY;
        return;
      }

      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;
      const shouldHide = scrollingDown && currentScrollY > 110;

      if (prefersReducedMotion) {
        topbar.classList.toggle("topbar-hidden", shouldHide);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY <= 24 || currentScrollY < lastScrollY) {
        topbar.classList.remove("topbar-hidden");
      } else if (shouldHide) {
        topbar.classList.add("topbar-hidden");
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", syncTopbarVisibility, { passive: true });
    window.addEventListener("resize", syncTopbarVisibility, { passive: true });
    syncTopbarVisibility();
  }

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeAuthModal();
    }
  });
})();
