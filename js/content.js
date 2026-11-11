/**
 * Portfolio content, taken from the public repos at github.com/grizz6 (READMEs and code, Oct 2026), the resume
 * (Oct 2026, the source of truth for numbers and dates) and the documents in files/. Numbers come from the repos' own READMEs.
 * The resume itself is not published. No phone number, GPA, or location on the site.
 */
window.PORTFOLIO = {
  name: "Grishma Gajurel",
  title: "Data analyst · Software engineer · Photographer",
  headline: "I turn messy data into sound decisions.",
  email: "gajurel.grizma@gmail.com",
  github: "https://github.com/grizz6",
  social: [
    { label: "GitHub", href: "https://github.com/grizz6" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/grishmagajurel/" },
  ],

  // Each project draws a small live figure (`viz`) of what it does. `line` is the one-line summary on the card and
  // `more` the detail behind it. The first four show; the rest sit behind Load more.
  projects: [
    {
      title: "Filings Q&A", year: "2026", viz: "cite",
      line: "Ask what a US company says about its risks; every sentence cites the 10-K passage it came from.",
      more: "A retrieval system over ten companies' SEC 10-K risk disclosures, built on pgvector and Gemini. Chunking experiments tracked in MLflow raised the retrieval hit rate from 75% to 90% on a 50-question benchmark, and questions the filings don't cover get “Not found.”",
      facts: ["75% → 90% retrieval hit rate", "50-question benchmark", "10 companies"],
      tags: ["pgvector", "Gemini", "Streamlit", "MLflow"],
      links: [{ label: "Live app", href: "https://filings.streamlit.app" }, { label: "Code", href: "https://github.com/grizz6/filings-qa" }],
    },
    {
      title: "synthkit", year: "2026", viz: "copula",
      line: "Test data with the shape of production and none of its rows.",
      more: "An open-source Python library and CLI. It learns how columns move together (a Gaussian copula), so tests that depend on a correlation still pass, and its drift checks fail the build when data departs from its saved profile.",
      facts: ["385 cross-platform tests", "drift checks in CI", "~2M rows/s"],
      tags: ["Gaussian copula", "pytest plugin", "CI"],
      links: [{ label: "Code", href: "https://github.com/grizz6/synthkit" }],
    },
    {
      title: "AI Data Analyst", year: "2026", viz: "outliers",
      line: "Drop in a CSV and get the whole exploratory pass, with no made-up numbers.",
      more: "Gaps, outliers with likely causes, relationships and next steps. The language model may only quote numbers the code computed: a safeguard rejects any figure it didn't, backed by 433 automated tests.",
      facts: ["433 automated tests", "every number checked", "CSV up to 200 MB"],
      tags: ["FastAPI", "pandas", "statsmodels", "React"],
      links: [{ label: "Live app", href: "https://ai-data-analyst-xz78.onrender.com" }, { label: "Code", href: "https://github.com/grizz6/ai-data-analyst" }],
    },
    {
      title: "Urban bee behaviour", year: "2025", viz: "bees",
      line: "Does a bee's species, or the pavement around an orchard, change how it forages?",
      more: "Camcorder ethograms from St. Louis orchards, 2022–2024, analysed with binomial mixed models. Co-authored poster at the ESA Annual Meeting, Baltimore, August 2025.",
      facts: ["ESA 2025 poster", "10 behaviours", "mixed models"],
      tags: ["R", "lme4", "GIS"],
      links: [{ label: "Poster", href: "files/Slide1.jpg" }, { label: "SEED report", href: "files/insect-distribution-usda.pdf" }, { label: "Code", href: "https://github.com/grizz6/ESA" }],
    },
    {
      title: "Orchard phenology & weather", year: "2025", viz: "bloom",
      line: "When the trees flower, when the insects fly, and how warm each orchard runs.",
      more: "Growing degree days per orchard, with weather rebuilt for sites that had no station. Presented at Research Across Disciplines, Webster University, December 2025.",
      facts: ["RAD 2025 talk", "growing degree days"],
      tags: ["R", "mixed models"],
      links: [{ label: "Report", href: "files/weather-regression.pdf" }, { label: "Slides", href: "files/rad.pdf" }, { label: "Code", href: "https://github.com/grizz6/R-Projects" }],
    },
    {
      title: "Analytics practicum", year: "2025", viz: "roc",
      line: "Three end-to-end models in R: mortgage default, catalogue buyers, used-phone prices.",
      more: "Random forests, gradient boosting and neural nets, tuned and compared with caret and glmnet, each written up as a report.",
      facts: ["random forest", "gradient boosting", "neural nets"],
      tags: ["R", "caret", "glmnet"],
      links: [{ label: "Mortgage", href: "files/mortgage-payback.pdf" }, { label: "Mailing", href: "files/software-mailing.pdf" }, { label: "Phones", href: "files/used-smartphone.pdf" }, { label: "Code", href: "https://github.com/grizz6/Academic-Project---Webster-University" }],
    },
    {
      title: "Computer-use automation", year: "2026", viz: "replay",
      line: "A model learns a task in an old app with no API once, then it replays for free.",
      more: "The model clicks through the app to work out the task. The run is saved as a typed capability that replays without the model and hands over to a person when it gets stuck.",
      facts: ["learn once, replay free", "human handoff"],
      tags: ["Playwright", "Pydantic", "Gemini"],
      links: [], // the repository is private, so no public link
    },
    {
      title: "Python notebooks", year: "2025", viz: "heat",
      line: "When 911 calls peak, and a survival model on 20,000 patient records.",
      more: "Hour-by-day patterns across 99,492 emergency calls, and a survival model on 20,000 patient records, in pandas, seaborn and scikit-learn.",
      facts: ["99,492 calls", "20,000 records"],
      tags: ["pandas", "seaborn", "scikit-learn"],
      links: [{ label: "Code", href: "https://github.com/grizz6/Python-mini-projects" }],
    },
  ],

  // A few lines in my own voice, shown after the intro. *word* marks the words set in the accent colour.
  about: [
    "Hi, I'm Grishma. I make messy data something you can *act on*.",
    "Off the clock I photograph cities, mostly *looking up*.",
    "Also: hiking, pixel art, mental health, and building my own things.",
  ],

  experience: [
    { dates: "Feb 2024 – Dec 2025", role: "Research Assistant, Natural Sciences and Mathematics", org: "Webster University", line: "Merged 10,000+ records from 7 institutions for a USDA study of 15 orchards, and fixed a bias that inflated the results." },
    { dates: "Feb 2021 – Jun 2023", role: "Software Engineer", org: "Aaran Tech", line: "Cut hourly data jobs from 80 to 42 minutes and wired eSewa and Khalti payments for 1,000+ orders a month." },
  ],
  education: [
    { degree: "M.S. Data Analytics", school: "Webster University", date: "May 2026" },
    { degree: "B.S. Computing", school: "London Metropolitan University", date: "Oct 2022" },
  ],

  // Photographs, all on an iPhone 15 Pro Max. Settings come from each file's EXIF (24mm main or 120mm telephoto
  // lens); place and month from the shoot. w and h are the file's pixel size, so the grid reserves the right space.
  camera: "iPhone 15 Pro Max",
  photos: [
    { src: "photos/gateway-arch.jpg", title: "Gateway Arch", place: "St. Louis", date: "Jun 2024", settings: "24mm · ƒ/1.8 · 1/4950 · ISO 100", w: 768, h: 1024 },
    { src: "photos/manhattan-bridge.jpg", title: "Manhattan Bridge from DUMBO", place: "New York", date: "Oct 2024", settings: "120mm · ƒ/2.8 · 1/1048 · ISO 50", w: 768, h: 1024 },
    { src: "photos/stained-glass-ceiling.jpg", title: "Stained-glass ceiling", place: "Boston", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/120 · ISO 80", w: 480, h: 360 },
    { src: "photos/hancock-tower.jpg", title: "Hancock Tower", place: "Boston", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/5376 · ISO 100", w: 768, h: 1024 },
    { src: "photos/lakefront-golden-hour.jpg", title: "Lakefront, golden hour", place: "Chicago", date: "Aug 2026", settings: "24mm · ƒ/1.8 · 1/459 · ISO 100", w: 360, h: 480 },
    { src: "photos/under-the-dome.jpg", title: "Under the dome", place: "", date: "Jan 2024", settings: "24mm · ƒ/1.8 · 1/120 · ISO 50", w: 768, h: 1024 },
    { src: "photos/mother-church-dusk.jpg", title: "The Mother Church at dusk", place: "Boston", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/216 · ISO 64", w: 768, h: 1024 },
    { src: "photos/chicago-river-above.jpg", title: "The river from above", place: "Chicago", date: "Aug 2026", settings: "120mm · ƒ/2.8 · 1/99 · ISO 160", w: 768, h: 1024 },
    { src: "photos/public-garden.jpg", title: "Public Garden", place: "Boston", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/6849 · ISO 100", w: 480, h: 360 },
    { src: "photos/skyline-rooftops.jpg", title: "Skyline over the rooftops", place: "New York", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/1172 · ISO 64", w: 360, h: 480 },
    { src: "photos/snow-at-night.jpg", title: "Snow, downtown at night", place: "Chicago", date: "Feb 2026", settings: "24mm · ƒ/1.8 · 1/40 · ISO 250", w: 310, h: 552 },
    { src: "photos/tower-in-fog.jpg", title: "Tower in the fog", place: "Chicago", date: "Feb 2026", settings: "24mm · ƒ/1.8 · 1/30 · ISO 640", w: 310, h: 552 },
    { src: "photos/salmon-citrus-greens.jpg", title: "Salmon, citrus, greens", place: "Boston", date: "Oct 2026", settings: "24mm · ƒ/1.8 · 1/40 · ISO 640", w: 360, h: 480 },
  ],

  skills: ["SQL", "Python", "R", "pandas", "PostgreSQL", "FastAPI", "React", "Power BI"],
};
