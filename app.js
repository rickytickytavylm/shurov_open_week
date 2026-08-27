(function () {
  const cfg = window.WEEK_CONFIG || {};

  function fill() {
    const dates = cfg.DATES || "три вечера, даты после вебинара";
    const time = cfg.TIME || "90 минут, вечером";
    const webinar = cfg.WEBINAR_WHEN || "27 августа, 19:00";
    document.querySelectorAll('[data-field="dates"]').forEach((el) => { el.textContent = dates; });
    document.querySelectorAll('[data-field="time"]').forEach((el) => { el.textContent = time; });
    document.querySelectorAll('[data-field="webinar"]').forEach((el) => { el.textContent = webinar; });
    document.querySelectorAll('[data-field="price"]').forEach((el) => { el.textContent = cfg.PRICE || "2 990 ₽"; });
    document.querySelectorAll('[data-link="tg"]').forEach((a) => { if (cfg.TG_WEBINAR) a.href = cfg.TG_WEBINAR; });
    document.querySelectorAll('[data-link="site"]').forEach((a) => { if (cfg.SITE_WEBINAR) a.href = cfg.SITE_WEBINAR; });
    const pay = document.getElementById("pay");
    if (pay && cfg.PAY_URL) {
      pay.href = cfg.PAY_URL;
      pay.target = "_blank";
      pay.rel = "noopener";
    }
  }

  function reveal() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const nodes = document.querySelectorAll(
      ".hero-copy, .shot, .intro, .stats li, .when div, .voices li, .panel, .steps li, .days li, .rail li, .offer-copy, .offer-card"
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

  function dock() {
    const bar = document.querySelector(".dock");
    const box = document.getElementById("offer");
    if (!bar || !box) return;
    const sync = () => {
      const pastHero = window.scrollY > 280;
      const offerOn = box.getBoundingClientRect().top < window.innerHeight * 0.72;
      bar.hidden = !pastHero || offerOn;
    };
    window.addEventListener("scroll", sync, { passive: true });
    sync();
  }

  fill();
  reveal();
  dock();
})();
