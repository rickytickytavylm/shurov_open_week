(function () {
  const cfg = window.WEEK_CONFIG || {};

  function fill() {
    const dates = cfg.DATES || "7, 9 и 12 сентября";
    const time = cfg.TIME || "три эфира, онлайн";
    document.querySelectorAll('[data-field="dates"]').forEach((el) => { el.textContent = dates; });
    document.querySelectorAll('[data-field="time"]').forEach((el) => { el.textContent = time; });
    document.querySelectorAll('[data-field="price"]').forEach((el) => { el.textContent = cfg.PRICE || "2 990 ₽"; });
  }

  function reveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll(
      ".hero-copy, .shot, .stats li, .when div, .voices li, .panel, .steps li, .days li, .rail li, .offer-copy, .offer-card"
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("in");
          io.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    nodes.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", (i % 6) * 60 + "ms");
      io.observe(el);
    });
  }

  function mountWidget() {
    const box = document.getElementById("gc-mount");
    if (!box || box.querySelector("iframe")) return;
    const hash = cfg.GC_WIDGET_HASH || "1137a73eaef7eb6e6e05c46e8ce240793655ffec";
    const src = cfg.GC_WIDGET_SRC || "https://tvoi-shag.online/pl/lite/widget/script?id=1648245";
    const existing = document.getElementById(hash);
    if (existing) {
      document.dispatchEvent(new Event("StartWidget" + hash));
      return;
    }
    const script = document.createElement("script");
    script.id = hash;
    script.src = src;
    script.onload = function () {
      document.dispatchEvent(new Event("StartWidget" + hash));
    };
    box.appendChild(script);
  }

  function sheets() {
    const nodes = Array.from(document.querySelectorAll(".sheet"));
    if (!nodes.length) return;

    const setOpen = (id, on) => {
      const sheet = document.getElementById(id);
      if (!sheet) return;
      sheet.classList.toggle("on", on);
      sheet.setAttribute("aria-hidden", on ? "false" : "true");
      if (on) {
        document.body.classList.add("sheet-lock");
        if (id === "sheet-pay") mountWidget();
        const closeBtn = sheet.querySelector(".sheet-x");
        if (closeBtn) closeBtn.focus();
      } else if (!nodes.some((n) => n.classList.contains("on"))) {
        document.body.classList.remove("sheet-lock");
      }
    };

    document.querySelectorAll("[data-open]").forEach((el) => {
      el.addEventListener("click", (e) => {
        const id = el.getAttribute("data-open");
        if (!id) return;
        e.preventDefault();
        nodes.forEach((n) => setOpen(n.id, n.id === id));
      });
    });

    nodes.forEach((sheet) => {
      sheet.querySelectorAll("[data-close]").forEach((btn) => {
        btn.addEventListener("click", () => setOpen(sheet.id, false));
      });
      sheet.addEventListener("click", (e) => {
        if (e.target === sheet) setOpen(sheet.id, false);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      nodes.forEach((n) => setOpen(n.id, false));
    });
  }

  function dock() {
    const bar = document.querySelector(".dock");
    const offer = document.getElementById("offer");
    if (!bar) return;
    const sync = () => {
      const pastHero = window.scrollY > 280;
      const offerOn = offer && offer.getBoundingClientRect().top < window.innerHeight * 0.72;
      const sheetOn = document.body.classList.contains("sheet-lock");
      bar.hidden = !pastHero || offerOn || sheetOn;
    };
    window.addEventListener("scroll", sync, { passive: true });
    document.addEventListener("click", () => setTimeout(sync, 0));
    sync();
  }

  fill();
  reveal();
  sheets();
  dock();
})();
