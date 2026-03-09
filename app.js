(function () {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mobileMenu = document.getElementById("mobileMenu");
  const mobileMenuBtn = document.getElementById("mobileMenuBtn");
  const mobileMenuClose = document.getElementById("mobileMenuClose");
  const mobileMenuLinks = document.querySelectorAll("[data-close-mobile-menu]");
  const authSection = document.getElementById("authSection");
  const authCloseBtn = document.getElementById("authCloseBtn");
  const googleAuthBtn = document.getElementById("googleAuthBtn");
  const authMessage = document.getElementById("authMessage");
  const authTriggers = document.querySelectorAll("[data-open-auth]");
  const cabinetBtn = document.querySelector(".topbar-actions [data-open-auth]");

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

  mobileMenuBtn?.addEventListener("click", openMobileMenu);
  mobileMenuClose?.addEventListener("click", closeMobileMenu);
  mobileMenuLinks.forEach((link) => link.addEventListener("click", closeMobileMenu));
  mobileMenu?.addEventListener("click", (event) => {
    if (event.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  const setAuthMessage = (text, type) => {
    if (!authMessage) return;
    authMessage.textContent = text || "";
    authMessage.classList.remove("error", "success");
    if (type) authMessage.classList.add(type);
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

  authTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      closeMobileMenu();
      openAuthModal();
    });
  });

  authCloseBtn?.addEventListener("click", closeAuthModal);
  authSection?.addEventListener("click", (event) => {
    if (event.target === authSection) {
      closeAuthModal();
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
      closeAuthModal();
    }
  });

  const firebaseConfig = {
    apiKey: "AIzaSyCOYK5xZ0fKwQSX64FgsCNGEepJV1xLY8o",
    authDomain: "kartochka1-a5f1b.firebaseapp.com",
    projectId: "kartochka1-a5f1b",
    storageBucket: "kartochka1-a5f1b.firebasestorage.app",
    messagingSenderId: "509819260153",
    appId: "1:509819260153:web:5ef8a90b9b24dc81aca628",
  };

  const hasFirebaseSdk = typeof window !== "undefined" && typeof window.firebase !== "undefined";
  const firebaseApp = hasFirebaseSdk
    ? window.firebase.apps.length
      ? window.firebase.app()
      : window.firebase.initializeApp(firebaseConfig)
    : null;
  const auth = firebaseApp ? window.firebase.auth() : null;
  const db = firebaseApp ? window.firebase.firestore() : null;
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
    if (code === "permission-denied") return "Firestore запрещает запись. Проверьте правила доступа";
    return error instanceof Error ? error.message : "Ошибка авторизации";
  };

  const syncCabinetButton = (user) => {
    if (!cabinetBtn) return;
    cabinetBtn.textContent = "Личный кабинет";
    if (!user) {
      cabinetBtn.removeAttribute("title");
      return;
    }

    const label = user.displayName || user.email || "Личный кабинет";
    cabinetBtn.setAttribute("title", label);
  };

  const persistUserProfile = async (user) => {
    if (!db || !user) return;
    await db
      .collection("users")
      .doc(user.uid)
      .set(
        {
          uid: user.uid,
          email: user.email || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          providers: (user.providerData || []).map((entry) => entry?.providerId).filter(Boolean),
          lastLoginAt: window.firebase.firestore.FieldValue.serverTimestamp(),
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
  };

  if (!hasFirebaseSdk) {
    setAuthMessage("Firebase SDK не загружен", "error");
  }

  googleAuthBtn?.addEventListener("click", async () => {
    if (!auth || !googleProvider) {
      setAuthMessage("Google Auth недоступен: Firebase не подключен", "error");
      return;
    }

    googleAuthBtn.setAttribute("disabled", "disabled");
    setAuthMessage("Открываем Google-авторизацию...", "");

    try {
      const result = await auth.signInWithPopup(googleProvider);
      await persistUserProfile(result.user);
      syncCabinetButton(result.user);
      setAuthMessage("Вход через Google выполнен", "success");
      closeAuthModal();
    } catch (error) {
      setAuthMessage(mapAuthError(error), "error");
    } finally {
      googleAuthBtn.removeAttribute("disabled");
    }
  });

  if (auth) {
    auth.onAuthStateChanged(async (user) => {
      syncCabinetButton(user);
      if (!user) return;
      try {
        await persistUserProfile(user);
      } catch (error) {
        setAuthMessage(mapAuthError(error), "error");
      }
    });
  } else {
    syncCabinetButton(null);
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

  const metricFills = Array.from(document.querySelectorAll(".kartochka-metric-bar-fill"));
  const animateMetricBars = () => {
    metricFills.forEach((fill) => {
      const progress = Math.max(0, Math.min(100, Number(fill.dataset.progress || 0)));
      fill.style.transform = "scaleX(" + progress / 100 + ")";
    });
  };

  if (metricFills.length) {
    requestAnimationFrame(() => {
      requestAnimationFrame(animateMetricBars);
    });
  }

  const topbar = document.querySelector(".topbar");
  if (topbar) {
    let lastScrollY = window.scrollY;

    const syncTopbarVisibility = () => {
      if (document.body.classList.contains("menu-open")) {
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
})();
