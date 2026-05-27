/**
 * Grishma Gajurel — static portfolio (single script, no server, no JSON fetch).
 */
(function () {
  "use strict";

/**
 * Site-wide configuration — edit before deploying.
 */
const SITE_CONFIG = {
  domain: "https://grizz6.github.io/grizgaj",
  name: "Grishma Gajurel",
  email: "gajurel.grizma@gmail.com",
  tagline:
    "I approach the world as an underfitted model, persistently seeking the underlying signal amidst the inherent variance.",
  bio: "Born in 2001, I engage in coding, questioning, and iterative refinement. My learning journey continues unabated across data science, ecology research, and building things on the web.",

  social: [
    {
      id: "github",
      label: "GitHub",
      href: "https://github.com/grizz6",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/grishma-gajurel-54891a2b5/",
    },
    {
      id: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/grizzz.ma",
    },
    {
      id: "mail",
      label: "Mail",
      href: "mailto:gajurel.grizma@gmail.com",
    },
  ],

  nav: [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ],
};

const PROJECTS = [
  {
    "id": "pollination-bee-foraging",
    "title": "Pollination & Urban Bee Foraging Study",
    "description": "Collaborated with interdisciplinary research teams across multiple universities to investigate the impact of urbanization on bee foraging behavior in urban orchards, examining whether increased pollinator diversity enhances pollination efficacy. Developed comprehensive statistical models and visualizations in R, including logistic, linear, linear mixed-effects, and multiple linear regression analyses. Findings presented at Ecological Society of America (ESA) in Baltimore, MD, August 2025.",
    "tags": [
      "research",
      "r",
      "ecology"
    ],
    "year": "2025",
    "featured": true,
    "initial": "P"
  },
  {
    "id": "python-911-analysis",
    "title": "Python Data Analysis Project",
    "description": "In this Python-based exploratory data analysis project, we utilized Pandas, Seaborn, and Matplotlib to analyze 911 emergency call data. The objective was to identify temporal and categorical patterns across EMS, Fire, and Traffic call types. By examining trends by hour, day, and month, we uncovered valuable insights.",
    "tags": [
      "python",
      "data-analysis",
      "pandas"
    ],
    "year": "2025",
    "href": "https://github.com/grizz6/Python-mini-projects/blob/main/911%20Call%20data/911%20Call%20data.ipynb",
    "featured": true,
    "initial": "9"
  },
  {
    "id": "pollination-urban-orchards",
    "title": "Maximizing Pollination Services in Urban Orchards",
    "description": "Conducted a comprehensive research report on pollination services provided by urban orchards in St. Louis, spanning 18 orchards, for SEED St. Louis. R language was used for data visualization and Adobe InDesign for layout design. The findings were shared to the community as well as the direct correlation between insect diversity and fruit yield, as well as identifying areas of pollination deficiency.",
    "tags": [
      "research",
      "r",
      "pollination"
    ],
    "year": "2025",
    "featured": true,
    "initial": "M"
  },
  {
    "id": "brain-tumor-ml",
    "title": "Python ML Project",
    "description": "A Python-based machine learning project utilizing a brain tumor dataset aims to predict patient survival rates based on clinical characteristics such as age, tumor size, tumor type, and growth rate. The project employs linear regression with comprehensive data preprocessing, encompassing outlier management, label encoding, and feature scaling. The objective is to identify the clinical factors that have the most significant impact on survival outcomes in brain tumor patients.",
    "tags": [
      "python",
      "machine-learning"
    ],
    "year": "2025",
    "href": "https://github.com/grizz6/Python-mini-projects/blob/main/brain%20tumor%20project/Grishma_Gajurel_project.ipynb",
    "featured": false,
    "initial": "M"
  },
  {
    "id": "software-mailing",
    "title": "Software Mailing Analysis",
    "description": "Utilized machine learning techniques, including logistic regression, neural networks, and K-means and hierarchical clustering, to classify potential customers from a 5-million-name mailing list for North Point Software. This classification enabled the optimization of campaign targeting strategies, thereby maximizing profitability.",
    "tags": [
      "machine-learning",
      "analytics"
    ],
    "year": "2025",
    "featured": false,
    "initial": "S"
  },
  {
    "id": "mortgage-payback",
    "title": "Mortgage Payback Analysis",
    "description": "Developed a mortgage risk analytics framework utilizing logistic regression, random-effects logistic regression, bagging, gradient boosting, and K-means clustering to predict loan defaults, forecast payoff timing, and segment borrowers based on risk profiles. This framework enables more informed underwriting and portfolio management decisions.",
    "tags": [
      "machine-learning",
      "finance"
    ],
    "year": "2025",
    "featured": false,
    "initial": "M"
  },
  {
    "id": "smartphone-price",
    "title": "Used Smartphone Price Analysis",
    "description": "A predictive analytics pipeline was developed for the used smartphone market, utilizing K-Nearest Neighbors (KNN) and Naive Bayes models across 15 device attributes. This pipeline enables accurate pricing and categorization of used devices, thereby assisting retailers and financial institutions in making informed pricing and trade-in decisions.",
    "tags": [
      "machine-learning",
      "analytics"
    ],
    "year": "2025",
    "featured": false,
    "initial": "U"
  },
  {
    "id": "weather-regression",
    "title": "Weather Regression",
    "description": "An R-based analysis was done to merge and clean multiple years of field-collected and database weather records across urban orchard locations in St. Louis. Linear regression was applied to validate field-collected measurements against database records for temperature, humidity, and wind speed, with the objective of ensuring data reliability and consistency across sites before their utilization in broader ecological analyses.",
    "tags": [
      "r",
      "regression",
      "research"
    ],
    "year": "2025",
    "featured": false,
    "initial": "W"
  },
  {
    "id": "portfolio-website",
    "title": "Portfolio Website",
    "description": "Built and designed a personal portfolio with HTML, CSS, and vanilla JavaScript to showcase data science and research projects. Hosted on GitHub Pages.",
    "tags": [
      "html",
      "css",
      "javascript",
      "web"
    ],
    "year": "2026",
    "href": "https://grishmagajurel.com/",
    "featured": false,
    "initial": "W"
  }
];

  const config = SITE_CONFIG;
  const projects = PROJECTS;

  function getBasePath() {
    if (window.location.protocol === "file:") return "";

    const parts = window.location.pathname.split("/").filter(Boolean);
    if (window.location.hostname.endsWith("github.io") && parts.length > 0) {
      return `/${parts[0]}/`;
    }
    return "/";
  }

  const BASE_PATH = getBasePath();

  function route(path) {
    return `${BASE_PATH}${path}`;
  }

  function assetPath(path) {
    if (!path) return path;
    if (/^https?:\/\//i.test(path)) return path;
    return route(path.replace(/^\//, ""));
  }

  function pageHref(id) {
    switch (id) {
      case "home":
        return route("");
      case "about":
        return route("about/");
      case "projects":
        return route("projects/");
      case "project":
        return route("project/");
      case "contact":
        return route("contact/");
      default:
        return route("");
    }
  }

  function getProjectHref(project) {
    if (project.href) return project.href;
    if (typeof PROJECT_FILES !== "undefined" && PROJECT_FILES[project.id]) {
      return assetPath(PROJECT_FILES[project.id]);
    }
    return null;
  }

  const page = document.body.dataset.page ?? "home";

  function navLink(item) {
    const active = item.id === page ? " is-active" : "";
    return `<li><a class="site-nav__link${active}" href="${pageHref(item.id)}" data-nav="${item.id}">${item.label}</a></li>`;
  }

  const headerHtml = `
    <a class="skip-link" href="#main">Skip to content</a>
    <header class="site-header" role="banner">
      <div class="site-header__inner">
        <a class="site-logo" href="${pageHref("home")}" aria-label="${config.name} — Home">
          <span class="site-logo__mark" aria-hidden="true"></span>
          <span class="site-logo__text">${config.name}</span>
        </a>
        <button
          type="button"
          class="nav-toggle"
          aria-expanded="false"
          aria-controls="site-nav"
          aria-label="Open menu"
        >
          <span class="nav-toggle__bar" aria-hidden="true"></span>
          <span class="nav-toggle__bar" aria-hidden="true"></span>
          <span class="nav-toggle__bar" aria-hidden="true"></span>
        </button>
        <nav id="site-nav" class="site-nav" aria-label="Primary">
          <ul class="site-nav__list">
            ${(config.nav ?? []).map(navLink).join("")}
          </ul>
        </nav>
      </div>
    </header>`;

  const footerHtml = `
    <footer class="site-footer" role="contentinfo">
      <div class="site-footer__inner">
        <p class="site-footer__copy">
          <span data-year></span> ${config.name}
        </p>
        <button type="button" class="theme-toggle" aria-label="Toggle color theme">
          <span class="theme-toggle__track" aria-hidden="true">
            <span class="theme-toggle__thumb"></span>
          </span>
          <span class="visually-hidden">Theme</span>
        </button>
      </div>
    </footer>`;

  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");
  if (headerSlot) headerSlot.innerHTML = headerHtml;
  if (footerSlot) footerSlot.innerHTML = footerHtml;

const PREVIEW_LENGTH = 160;

/* Theme ------------------------------------------------------------------- */

const THEME_KEY = "portfolio-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  applyTheme(getPreferredTheme());

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "dark" ? "light" : "dark");
    });
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme("dark");
      }
    });
}

/* Navigation -------------------------------------------------------------- */

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  // Backdrop so the page content doesn't visually bleed through under the menu.
  const backdrop = document.createElement("div");
  backdrop.className = "nav-backdrop";
  backdrop.setAttribute("aria-hidden", "true");
  document.body.appendChild(backdrop);

  function setNavOpen(open) {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    backdrop.classList.toggle("is-visible", open);
  }

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setNavOpen(!open);
  });

  backdrop.addEventListener("click", () => setNavOpen(false));

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setNavOpen(false));
  });
}

/* Helpers ----------------------------------------------------------------- */

function truncatePreview(text, max = PREVIEW_LENGTH) {
  if (!text || text.length <= max) return text ?? "";
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}

function tagHue(tag, index) {
  const hues = ["violet", "sky", "peach", "mint", "rose", "lavender"];
  if (tag?.includes("python")) return "sky";
  if (tag?.includes("r")) return "violet";
  if (tag?.includes("machine")) return "lavender";
  if (tag?.includes("research")) return "mint";
  return hues[index % hues.length];
}

/* Project cards ----------------------------------------------------------- */

function createProjectCard(project, index) {
  const li = document.createElement("li");
  li.className = "project-card";
  li.dataset.tags = project.tags?.join(" ") ?? "";
  li.dataset.title = project.title?.toLowerCase() ?? "";
  li.dataset.animate = "fade-up";
  li.style.setProperty("--delay", String(Math.min(index, 8)));

  const link = document.createElement("a");
  link.className = "project-card__link";
  link.href = `${pageHref("project")}?id=${encodeURIComponent(project.id)}`;

  const strip = document.createElement("div");
  strip.className = `project-card__strip project-card__strip--${tagHue(project.tags?.[0], index)}`;
  strip.setAttribute("aria-hidden", "true");

  const body = document.createElement("div");
  body.className = "project-card__body";

  const top = document.createElement("div");
  top.className = "project-card__top";

  const title = document.createElement("h3");
  title.className = "project-card__title";
  title.textContent = project.title;

  const year = document.createElement("span");
  year.className = "project-card__year";
  year.textContent = project.year ?? "";

  top.append(title, year);

  const preview = document.createElement("p");
  preview.className = "project-card__preview";
  preview.textContent = truncatePreview(project.description);

  const footer = document.createElement("div");
  footer.className = "project-card__footer";

  if (project.tags?.length) {
    const tags = document.createElement("div");
    tags.className = "project-card__tags";
    project.tags.forEach((tag, i) => {
      const span = document.createElement("span");
      span.className = `project-card__tag project-card__tag--${tagHue(tag, i)}`;
      span.textContent = tag;
      tags.appendChild(span);
    });
    footer.appendChild(tags);
  }

  const cta = document.createElement("span");
  cta.className = "project-card__cta";
  const href = getProjectHref(project);
  cta.textContent = href?.includes("github")
    ? "View on GitHub →"
    : "View project →";
  footer.appendChild(cta);

  body.append(top, preview, footer);
  link.append(strip, body);
  li.appendChild(link);
  return li;
}

function createHomeProjectRow(project, index) {
  const li = document.createElement("li");
  li.className = "home-index__item";
  li.dataset.animate = "fade-up";
  li.style.setProperty("--delay", String(index));

  const num = String(index + 1).padStart(2, "0");
  const tags = (project.tags ?? []).slice(0, 4).join(" · ");

  const a = document.createElement("a");
  a.className = "home-index__link";
  a.href = `${pageHref("project")}?id=${encodeURIComponent(project.id)}`;

  const numEl = document.createElement("span");
  numEl.className = "home-index__num";
  numEl.textContent = num;

  const main = document.createElement("span");
  main.className = "home-index__main";
  const titleEl = document.createElement("span");
  titleEl.className = "home-index__title";
  titleEl.textContent = project.title ?? "";
  main.appendChild(titleEl);
  if (tags) {
    const meta = document.createElement("span");
    meta.className = "home-index__meta";
    meta.textContent = tags;
    main.appendChild(meta);
  }

  const yearEl = document.createElement("span");
  yearEl.className = "home-index__year";
  yearEl.textContent = project.year ?? "";

  const cta = document.createElement("span");
  cta.className = "home-index__cta";
  cta.textContent = "View project →";

  a.append(numEl, main, yearEl, cta);
  li.appendChild(a);
  return li;
}

function renderHomeProjects() {
  const container = document.getElementById("home-projects");
  if (!container) return;

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  container.replaceChildren(
    ...featured.map((p, i) => createHomeProjectRow(p, i))
  );
  observeAnimations(container);
}

const HOME_SECRETS = [
  "low bias, high curiosity",
  "check the residuals",
  "signal over noise",
];

function initHomeSecrets() {
  const hero = document.querySelector(".home-hero");
  if (!hero) return;

  const secretEl = document.getElementById("home-secret");
  const surname = hero.querySelector(".home-hero__line--dark");
  const roleDot = hero.querySelector(".home-hero__role-dot");
  const scrollBtn = hero.querySelector(".home-hero__scroll-btn");
  const workSection = document.querySelector(".home-index");

  let secretIndex = 0;
  let roleClicks = 0;
  let typed = "";

  function reveal(msg) {
    if (secretEl) {
      secretEl.textContent = msg;
      secretEl.classList.add("is-visible");
    }
    hero.classList.add("is-secret");
    window.setTimeout(() => hero.classList.remove("is-secret"), 1600);
  }

  roleDot?.addEventListener("click", () => {
    roleClicks += 1;
    reveal(HOME_SECRETS[(roleClicks - 1) % HOME_SECRETS.length]);
  });

  surname?.addEventListener("dblclick", () => {
    reveal("the model is still training.");
  });

  scrollBtn?.addEventListener("click", () => {
    workSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("keydown", (e) => {
    if (!document.body.classList.contains("page-home")) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    typed = (typed + e.key).slice(-6);
    if (typed.endsWith("signal")) {
      reveal("you found the signal.");
      typed = "";
    }
  });
}

function initContactPage() {
  const copyBtn = document.getElementById("contact-copy");
  const status = document.getElementById("contact-status");
  const email = config.email;

  copyBtn?.addEventListener("click", async () => {
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      copyBtn.classList.add("is-copied");
      if (status) status.textContent = "Email copied to clipboard.";
      window.setTimeout(() => {
        copyBtn.classList.remove("is-copied");
        if (status) status.textContent = "Ready when you are.";
      }, 2200);
    } catch {
      if (status) status.textContent = "Copy failed — use the mail link.";
    }
  });

  document.querySelectorAll(".contact-social__card").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      if (status) {
        status.textContent = `Opening ${link.querySelector(".contact-social__name")?.textContent ?? "profile"}…`;
      }
    });
    link.addEventListener("mouseleave", () => {
      if (status && !copyBtn?.classList.contains("is-copied")) {
        status.textContent = "Ready when you are.";
      }
    });
  });
}

function initGlobalMotion() {
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("mouseenter", () => link.classList.add("is-hover"));
    link.addEventListener("mouseleave", () => link.classList.remove("is-hover"));
  });
}

function getAllTags() {
  const tags = new Set();
  projects.forEach((p) => p.tags?.forEach((t) => tags.add(t)));
  return [...tags].sort();
}

function renderProjectFilters() {
  const container = document.getElementById("project-filters");
  if (!container) return;

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "filter-chip is-active";
  allBtn.textContent = "All";
  allBtn.dataset.filter = "all";
  container.appendChild(allBtn);

  getAllTags().forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-chip";
    btn.textContent = tag;
    btn.dataset.filter = tag;
    container.appendChild(btn);
  });
}

function renderProjectsList(filterTag = "all", searchQuery = "") {
  const container = document.getElementById("projects-list");
  const empty = document.getElementById("projects-empty");
  if (!container) return;

  const q = searchQuery.trim().toLowerCase();

  const filtered = projects.filter((p) => {
    const matchesTag =
      filterTag === "all" || (p.tags && p.tags.includes(filterTag));
    const matchesSearch =
      !q ||
      p.title?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.tags?.some((t) => t.toLowerCase().includes(q));
    return matchesTag && matchesSearch;
  });

  container.replaceChildren(
    ...filtered.map((p, i) => createProjectCard(p, i))
  );

  if (empty) {
    empty.hidden = filtered.length > 0;
  }

  observeAnimations(container);
}

function initProjectsPage() {
  const list = document.getElementById("projects-list");
  if (!list) return;

  let activeFilter = "all";
  let searchQuery = "";

  renderProjectFilters();
  renderProjectsList(activeFilter, searchQuery);

  document.getElementById("project-filters")?.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;

    activeFilter = chip.dataset.filter ?? "all";
    document.querySelectorAll(".filter-chip").forEach((c) => {
      c.classList.toggle("is-active", c === chip);
    });
    renderProjectsList(activeFilter, searchQuery);
  });

  document.getElementById("project-search")?.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProjectsList(activeFilter, searchQuery);
  });
}

/* Project detail page ----------------------------------------------------- */

function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function isExternalUrl(href) {
  return Boolean(href?.startsWith("http") && !href.includes("project/"));
}

function renderProjectDetail() {
  const container = document.getElementById("project-detail");
  if (!container) return;

  const id = getProjectIdFromUrl();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    container.innerHTML = `
      <p>Project not found.</p>
      <a class="btn btn--ghost" href="${pageHref("projects")}">Back to projects</a>`;
    document.title = "Not found — Grishma Gajurel";
    return;
  }

  document.title = `${project.title} — Grishma Gajurel`;

  const tagsHtml = (project.tags ?? [])
    .map(
      (t, i) =>
        `<span class="project-detail__tag project-detail__tag--${tagHue(t, i)}">${t}</span>`
    )
    .join("");

  const href = getProjectHref(project);
  const linkLabel = href?.includes("github")
    ? "View on GitHub"
    : href && !isExternalUrl(href)
      ? "View File"
      : "View project";

  container.innerHTML = `
    <a class="project-detail__back" href="${pageHref("projects")}">← All projects</a>
    <h1 class="project-detail__title">${project.title}</h1>
    <div class="project-detail__meta">
      ${project.year ? `<span>${project.year}</span>` : ""}
      <div class="project-detail__tags">${tagsHtml}</div>
    </div>
    <div class="project-detail__body">
      <p>${project.description}</p>
    </div>
  `;

  if (href) {
    const actions = document.createElement("div");
    actions.className = "project-detail__actions";
    const a = document.createElement("a");
    a.className = "btn btn--primary";
    a.href = href;
    a.textContent = linkLabel;
    if (isExternalUrl(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    } else {
      a.target = "_blank";
      a.rel = "noopener";
    }
    actions.appendChild(a);
    container.appendChild(actions);
  }

  observeAnimations(container);
}

function renderContactPage() {
  const emailLink = document.getElementById("contact-email-link");
  const emailDisplay = document.getElementById("contact-email-display");
  const links = document.getElementById("contact-links");
  if (!emailLink && !links) return;

  if (emailLink && config.email) {
    emailLink.href = `mailto:${config.email}`;
    if (emailDisplay) emailDisplay.textContent = config.email;
  }

  if (!links || !config.social?.length) return;

  links.replaceChildren(
    ...config.social
      .filter((item) => item.id !== "mail")
      .map((item) => {
        const a = document.createElement("a");
        a.className = "contact-social__card";
        a.href = item.href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const name = document.createElement("span");
        name.className = "contact-social__name";
        name.textContent = item.label;

        const arrow = document.createElement("span");
        arrow.className = "contact-social__arrow";
        arrow.setAttribute("aria-hidden", "true");
        arrow.textContent = "↗";

        a.append(name, arrow);
        return a;
      })
  );

  initContactPage();
}

/* About page copy --------------------------------------------------------- */

function populateAbout() {
  const tagline = document.getElementById("about-tagline");
  const bio = document.getElementById("about-bio");
  if (tagline && config.tagline) tagline.textContent = config.tagline;
  if (bio && config.bio) bio.textContent = config.bio;
}

/* Animations -------------------------------------------------------------- */

function observeAnimations(root = document) {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const elements = root.querySelectorAll("[data-animate]:not(.is-visible)");
  if (prefersReduced) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.style.getPropertyValue("--delay");
          if (delay) {
            entry.target.style.transitionDelay = `${Number(delay) * 80}ms`;
          }
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -24px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* Footer year ------------------------------------------------------------- */

function setYear() {
  const year = new Date().getFullYear();
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(year);
  });
}

/* Init -------------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-loaded");
  initTheme();
  initMobileNav();
  populateAbout();
  renderContactPage();
  renderHomeProjects();
  initProjectsPage();
  renderProjectDetail();
  initHomeSecrets();
  initGlobalMotion();
  setYear();
  observeAnimations();
});
})();
